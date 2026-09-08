-- ============================================================================
-- Migration : Table access_codes & Fonction de vérification (Sama Daara)
-- ============================================================================

-- 1. Création du type statut si nécessaire
DO $$ BEGIN
    CREATE TYPE access_code_status AS ENUM ('pending', 'verified', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Création de la table access_codes
CREATE TABLE IF NOT EXISTS public.access_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    code VARCHAR(12) NOT NULL,
    status access_code_status NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 minutes'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at TIMESTAMPTZ NULL
);

-- Index pour accélérer les recherches par email, code et statut
CREATE INDEX IF NOT EXISTS idx_access_codes_email_code 
    ON public.access_codes (email, code, status);

CREATE INDEX IF NOT EXISTS idx_access_codes_expires_at 
    ON public.access_codes (expires_at);

-- 3. Activation de Row Level Security (RLS)
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Politique de lecture : l'utilisateur authentifié ne peut lire que ses propres codes
DROP POLICY IF EXISTS "Users can read their own access codes" ON public.access_codes;
CREATE POLICY "Users can read their own access codes"
    ON public.access_codes
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR auth.jwt() ->> 'email' = email
        OR auth.role() = 'service_role'
    );

-- Politique d'insertion : réservée aux fonctions backend / service_role
DROP POLICY IF EXISTS "Service role can insert access codes" ON public.access_codes;
CREATE POLICY "Service role can insert access codes"
    ON public.access_codes
    FOR ALL
    USING (auth.role() = 'service_role');

-- Permettre l'accès anonyme restreint aux fonctions RPC Security Definer ci-dessous
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.access_codes TO anon, authenticated, service_role;

-- 4. Fonction RPC sécurisée pour vérifier un code d'accès
-- Accessible côté client via supabase.rpc('verify_access_code', { p_email, p_code })
CREATE OR REPLACE FUNCTION public.verify_access_code(
    p_email TEXT,
    p_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
BEGIN
    -- Nettoyage des paramètres
    p_email := lower(trim(p_email));
    p_code := trim(p_code);

    -- Recherche du code en attente le plus récent pour cet email
    SELECT id, code, status, expires_at
    INTO v_record
    FROM public.access_codes
    WHERE lower(email) = p_email
      AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Cas 1 : Aucun code en attente trouvé
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'not_found',
            'message', 'Aucun code actif trouvé pour cette adresse. Veuillez en demander un nouveau.'
        );
    END IF;

    -- Cas 2 : Le code a expiré
    IF v_record.expires_at < now() THEN
        UPDATE public.access_codes
        SET status = 'expired'
        WHERE id = v_record.id;

        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'expired',
            'message', 'Ce code a expiré (validité 15 minutes). Veuillez cliquer sur « Renvoyer le code ».'
        );
    END IF;

    -- Cas 3 : Le code ne correspond pas
    IF v_record.code <> p_code THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'mismatch',
            'message', 'Code d''accès incorrect. Veuillez vérifier les 6 chiffres reçus par email.'
        );
    END IF;

    -- Cas 4 : Code valide -> Marquer comme vérifié
    UPDATE public.access_codes
    SET status = 'verified',
        verified_at = now()
    WHERE id = v_record.id;

    RETURN jsonb_build_object(
        'valid', true,
        'message', 'Code d''accès validé avec succès.'
    );
END;
$$;

-- Accorder l'exécution de la fonction aux rôles anon et authenticated
GRANT EXECUTE ON FUNCTION public.verify_access_code(TEXT, TEXT) TO anon, authenticated, service_role;

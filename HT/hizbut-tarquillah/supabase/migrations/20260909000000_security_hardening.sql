-- ============================================================================
-- Migration : Durcissement Global de la Sécurité & Politiques RLS (Sama Daara)
-- Date : 2026-09-09
-- ============================================================================

-- 1. Sécurisation anti-bruteforce de la table access_codes
ALTER TABLE IF EXISTS public.access_codes 
ADD COLUMN IF NOT EXISTS attempts INT NOT NULL DEFAULT 0;

-- Remplacement de verify_access_code avec verrouillage à 5 tentatives
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
    p_email := lower(trim(p_email));
    p_code := trim(p_code);

    -- Recherche du code en attente le plus récent
    SELECT id, code, status, expires_at, attempts
    INTO v_record
    FROM public.access_codes
    WHERE lower(email) = p_email
      AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Cas 1 : Aucun code en attente
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'not_found',
            'message', 'Aucun code actif trouvé pour cette adresse. Veuillez en demander un nouveau.'
        );
    END IF;

    -- Cas 2 : Code verrouillé pour cause de force brute (> 5 essais)
    IF v_record.attempts >= 5 THEN
        UPDATE public.access_codes
        SET status = 'expired'
        WHERE id = v_record.id;

        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'locked',
            'message', 'Trop de tentatives erronées (maximum 5). Ce code a été révoqué par sécurité.'
        );
    END IF;

    -- Cas 3 : Expiration temporelle (15 min)
    IF v_record.expires_at < now() THEN
        UPDATE public.access_codes
        SET status = 'expired'
        WHERE id = v_record.id;

        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'expired',
            'message', 'Ce code a expiré. Veuillez cliquer sur « Renvoyer le code ».'
        );
    END IF;

    -- Cas 4 : Code incorrect -> Incrémenter les tentatives
    IF v_record.code <> p_code THEN
        UPDATE public.access_codes
        SET attempts = attempts + 1
        WHERE id = v_record.id;

        RETURN jsonb_build_object(
            'valid', false,
            'reason', 'mismatch',
            'remaining_attempts', 4 - v_record.attempts,
            'message', 'Code incorrect. Tentatives restantes : ' || (4 - v_record.attempts)::text
        );
    END IF;

    -- Cas 5 : Code valide
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

-- 2. Activation du RLS sur toutes les tables métiers
DO $$ 
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'membres', 'zones', 'kourels', 'secteurs', 
        'khassidas', 'sons_audio', 'seances', 'presences', 
        'kamil_cycles', 'juz_assignations', 'informations'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
        END IF;
    END LOOP;
END $$;

-- 3. Politiques RLS pour la consultation et l'administration

-- Khassidas & Sons Audio : Consultation publique/authentifiée, écriture sécurisée
DO $$ BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'khassidas') THEN
        DROP POLICY IF EXISTS "Khassidas lecture pour tous" ON public.khassidas;
        CREATE POLICY "Khassidas lecture pour tous" ON public.khassidas FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Khassidas écriture réservée" ON public.khassidas;
        CREATE POLICY "Khassidas écriture réservée" ON public.khassidas FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sons_audio') THEN
        DROP POLICY IF EXISTS "Sons lecture pour tous" ON public.sons_audio;
        CREATE POLICY "Sons lecture pour tous" ON public.sons_audio FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Sons écriture réservée" ON public.sons_audio;
        CREATE POLICY "Sons écriture réservée" ON public.sons_audio FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'informations') THEN
        DROP POLICY IF EXISTS "Infos lecture pour tous" ON public.informations;
        CREATE POLICY "Infos lecture pour tous" ON public.informations FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Infos écriture réservée" ON public.informations;
        CREATE POLICY "Infos écriture réservée" ON public.informations FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membres') THEN
        DROP POLICY IF EXISTS "Membres lecture autorisée" ON public.membres;
        CREATE POLICY "Membres lecture autorisée" ON public.membres FOR SELECT 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

        DROP POLICY IF EXISTS "Membres gestion réservée" ON public.membres;
        CREATE POLICY "Membres gestion réservée" ON public.membres FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'kamil_cycles') THEN
        DROP POLICY IF EXISTS "Kamil cycles lecture autorisée" ON public.kamil_cycles;
        CREATE POLICY "Kamil cycles lecture autorisée" ON public.kamil_cycles FOR SELECT 
        USING (true);

        DROP POLICY IF EXISTS "Kamil cycles gestion réservée" ON public.kamil_cycles;
        CREATE POLICY "Kamil cycles gestion réservée" ON public.kamil_cycles FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'juz_assignations') THEN
        DROP POLICY IF EXISTS "Assignations lecture autorisée" ON public.juz_assignations;
        CREATE POLICY "Assignations lecture autorisée" ON public.juz_assignations FOR SELECT 
        USING (true);

        DROP POLICY IF EXISTS "Assignations gestion réservée" ON public.juz_assignations;
        CREATE POLICY "Assignations gestion réservée" ON public.juz_assignations FOR ALL 
        USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
        WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;
END $$;

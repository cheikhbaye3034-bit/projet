-- ============================================================================
-- Migration : Système de Notifications & Préférences Utilisateurs (Sama Daara)
-- ============================================================================

-- 1. ENUMs
DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('repetition_reminder', 'info_pinned', 'kamil_deadline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('push', 'email', 'in_app');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'skipped');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table notification_preferences
-- Gère les préférences globales et par type de notification pour chaque utilisateur
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    repetition_reminder_enabled BOOLEAN NOT NULL DEFAULT true,
    info_pinned_enabled BOOLEAN NOT NULL DEFAULT true,
    kamil_deadline_enabled BOOLEAN NOT NULL DEFAULT true,
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    email_enabled BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index sur user_id
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user 
    ON public.notification_preferences (user_id);

-- 3. Table notifications
-- Stocke toutes les notifications générées avec leur statut de livraison
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    related_entity_id TEXT NULL,
    channel notification_channel NOT NULL DEFAULT 'in_app',
    status notification_status NOT NULL DEFAULT 'pending',
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour la recherche par utilisateur et statut (file d'attente / in-app)
CREATE INDEX IF NOT EXISTS idx_notifications_user_status 
    ON public.notifications (user_id, status);

CREATE INDEX IF NOT EXISTS idx_notifications_pending_scheduled 
    ON public.notifications (status, scheduled_at)
    WHERE status = 'pending';

-- 4. Row Level Security (RLS)
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques sur notification_preferences
DROP POLICY IF EXISTS "Users can read their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can read their own preferences"
    ON public.notification_preferences
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Users can update their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can update their own preferences"
    ON public.notification_preferences
    FOR UPDATE
    USING (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    )
    WITH CHECK (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert their own preferences"
    ON public.notification_preferences
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    );

-- Politiques sur notifications
DROP POLICY IF EXISTS "Users can read their own notifications" ON public.notifications;
CREATE POLICY "Users can read their own notifications"
    ON public.notifications
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Users can update their own notifications read status" ON public.notifications;
CREATE POLICY "Users can update their own notifications read status"
    ON public.notifications
    FOR UPDATE
    USING (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    )
    WITH CHECK (
        auth.uid()::text = user_id 
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Service role can manage all notifications" ON public.notifications;
CREATE POLICY "Service role can manage all notifications"
    ON public.notifications
    FOR ALL
    USING (auth.role() = 'service_role');

-- Droits minimaux accordés
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;
GRANT ALL ON public.notifications TO service_role;

-- 5. Trigger PostgreSQL : Information épinglée (trigger DB)
-- Déclenché à l'insertion ou mise à jour d'une actualité avec is_pinned = true
CREATE OR REPLACE FUNCTION public.handle_pinned_information()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_member RECORD;
    v_pref RECORD;
BEGIN
    -- Ne s'exécute que si l'information est marquée comme épinglée
    IF (TG_OP = 'INSERT' AND NEW.is_pinned = true) 
       OR (TG_OP = 'UPDATE' AND NEW.is_pinned = true AND (OLD.is_pinned IS DISTINCT FROM true)) THEN
        
        -- Parcourir tous les membres
        FOR v_member IN SELECT id, prenom, nom, email FROM public.membres LOOP
            -- Vérifier les préférences de notification du membre
            SELECT notifications_enabled, info_pinned_enabled, push_enabled, email_enabled
            INTO v_pref
            FROM public.notification_preferences
            WHERE user_id = v_member.id::text;

            -- Règle : notifications_enabled = true ET info_pinned_enabled = true
            -- Si aucune préférence n'est encore enregistrée, les valeurs par défaut sont true
            IF (v_pref.notifications_enabled IS NULL OR v_pref.notifications_enabled = true)
               AND (v_pref.info_pinned_enabled IS NULL OR v_pref.info_pinned_enabled = true) THEN
                
                -- Création de la notification in_app
                INSERT INTO public.notifications (
                    user_id,
                    type,
                    title,
                    body,
                    related_entity_id,
                    channel,
                    status,
                    scheduled_at
                ) VALUES (
                    v_member.id::text,
                    'info_pinned',
                    '📌 Annonce importante : ' || COALESCE(NEW.titre, 'Nouvelle information'),
                    COALESCE(SUBSTRING(NEW.contenu FROM 1 FOR 140), 'Une nouvelle information officielle vient d''être épinglée.'),
                    NEW.id::text,
                    'in_app',
                    'pending',
                    now()
                );

                -- Si push_enabled = true, ajouter notification push
                IF v_pref.push_enabled IS NULL OR v_pref.push_enabled = true THEN
                    INSERT INTO public.notifications (
                        user_id,
                        type,
                        title,
                        body,
                        related_entity_id,
                        channel,
                        status,
                        scheduled_at
                    ) VALUES (
                        v_member.id::text,
                        'info_pinned',
                        '📌 ' || COALESCE(NEW.titre, 'Annonce Sama Daara'),
                        COALESCE(SUBSTRING(NEW.contenu FROM 1 FOR 140), 'Nouvelle annonce épinglée disponible.'),
                        NEW.id::text,
                        'push',
                        'pending',
                        now()
                    );
                END IF;

                -- Si email_enabled = true, ajouter notification email
                IF v_pref.email_enabled = true THEN
                    INSERT INTO public.notifications (
                        user_id,
                        type,
                        title,
                        body,
                        related_entity_id,
                        channel,
                        status,
                        scheduled_at
                    ) VALUES (
                        v_member.id::text,
                        'info_pinned',
                        '📌 Annonce officielle : ' || COALESCE(NEW.titre, 'Sama Daara'),
                        COALESCE(NEW.contenu, 'Une nouvelle annonce épinglée a été publiée sur la plateforme Sama Daara.'),
                        NEW.id::text,
                        'email',
                        'pending',
                        now()
                    );
                END IF;

            END IF;
        END LOOP;

    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_pinned_info ON public.informations;
CREATE TRIGGER trg_notify_pinned_info
    AFTER INSERT OR UPDATE OF is_pinned, titre, contenu
    ON public.informations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_pinned_information();

-- 6. Configuration des crons pg_cron (optionnelle dans Supabase SQL Editor)
-- Requiert l'extension pg_cron (CREATE EXTENSION IF NOT EXISTS pg_cron;)
/*
SELECT cron.schedule(
    'check-repetition-reminders',
    '*/10 * * * *',
    $$SELECT net.http_post(
        url := (SELECT current_setting('app.settings.supabase_url') || '/functions/v1/check-repetition-reminders'),
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        )
    );$$
);

SELECT cron.schedule(
    'check-kamil-deadline',
    '0 8 * * *',
    $$SELECT net.http_post(
        url := (SELECT current_setting('app.settings.supabase_url') || '/functions/v1/check-kamil-deadline'),
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        )
    );$$
);

SELECT cron.schedule(
    'send-notifications',
    '*/5 * * * *',
    $$SELECT net.http_post(
        url := (SELECT current_setting('app.settings.supabase_url') || '/functions/v1/send-notifications'),
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        )
    );$$
);
*/

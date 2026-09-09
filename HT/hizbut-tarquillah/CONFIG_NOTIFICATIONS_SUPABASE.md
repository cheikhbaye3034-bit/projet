# Guide de Configuration & Déploiement — Système de Notifications (Sama Daara)

Ce document fournit la procédure complète pour activer et déployer le système de notifications automatisé 100% basé sur **Supabase** (PostgreSQL, Triggers, Edge Functions, pg_cron).

---

## 1. Activation des Extensions dans Supabase

Pour exécuter les tâches planifiées (`pg_cron`) et les appels webhooks HTTP (`pg_net`) :

1. Connectez-vous sur votre [Dashboard Supabase](https://supabase.com/dashboard/project/alyrucyihkxczwzgoxzu).
2. Allez dans **Database → Extensions**.
3. Recherchez et activez (toggle ON) :
   - `pg_cron` (Job scheduler for PostgreSQL)
   - `pg_net` (Async HTTP requests from PostgreSQL)

---

## 2. Déploiement de la Migration SQL

1. Dans votre Dashboard Supabase, ouvrez le **SQL Editor**.
2. Créez une nouvelle requête et collez l'intégralité du script :
   `supabase/migrations/20260908100000_create_notifications_schema.sql`
3. Cliquez sur **Run**.
4. Cela crée automatiquement :
   - Les types ENUM (`notification_type`, `notification_channel`, `notification_status`).
   - La table `notification_preferences` (avec RLS et index).
   - La table `notifications` (avec RLS et index).
   - Le trigger PostgreSQL `trg_notify_pinned_info` sur la table `informations` (déclenché dès qu'une information est marquée `is_pinned = true`).

---

## 3. Déploiement des 4 Edge Functions

Ouvrez votre terminal dans le dossier du projet (`HT/hizbut-tarquillah`) :

```bash
# 1. Vérification de la liaison au projet Supabase
npx supabase link --project-ref alyrucyihkxczwzgoxzu

# 2. Déploiement de la fonction de rappel des répétitions (1h avant)
npx supabase functions deploy check-repetition-reminders --no-verify-jwt

# 3. Déploiement de la fonction d'alerte information épinglée
npx supabase functions deploy notify-pinned-info --no-verify-jwt

# 4. Déploiement de la fonction d'échéance Kamil (J-2)
npx supabase functions deploy check-kamil-deadline --no-verify-jwt

# 5. Déploiement de la fonction de traitement d'envoi (emails Resend & push)
npx supabase functions deploy send-notifications --no-verify-jwt
```

---

## 4. Configuration des Tâches Planifiées (pg_cron)

Dans le **SQL Editor** de Supabase, activez les 3 cron jobs suivants :

```sql
-- 1. Vérification des répétitions toutes les 10 minutes
SELECT cron.schedule(
    'check-repetition-reminders',
    '*/10 * * * *',
    $$SELECT net.http_post(
        url := 'https://alyrucyihkxczwzgoxzu.supabase.co/functions/v1/check-repetition-reminders',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer VOTRE_SERVICE_ROLE_KEY'
        )
    );$$
);

-- 2. Vérification de l'échéance Kamil tous les jours à 08h00
SELECT cron.schedule(
    'check-kamil-deadline',
    '0 8 * * *',
    $$SELECT net.http_post(
        url := 'https://alyrucyihkxczwzgoxzu.supabase.co/functions/v1/check-kamil-deadline',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer VOTRE_SERVICE_ROLE_KEY'
        )
    );$$
);

-- 3. Traitement de la file d'attente d'envoi toutes les 5 minutes
SELECT cron.schedule(
    'send-notifications',
    '*/5 * * * *',
    $$SELECT net.http_post(
        url := 'https://alyrucyihkxczwzgoxzu.supabase.co/functions/v1/send-notifications',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer VOTRE_SERVICE_ROLE_KEY'
        )
    );$$
);
```

---

## 5. Fonctionnement Côté Client (Interface Réglages)

- **Côté Responsable** : Ouvrez l'onglet **"Réglages"** → sélectionnez le nouvel onglet **"Notifications"**.
- **Côté Membre** : Ouvrez **"Mon Profil"** → descendez jusqu'au bloc **"Mes Préférences de Notifications"**.
- **Comportement des toggles** :
  - L'interrupteur principal active ou coupe instantanément toutes les notifications.
  - Lorsqu'il est désactivé, les sous-options sont grisées et inaccessibles (`pointer-events-none`).
  - Chaque modification est immédiatement sauvegardée sans bouton d'enregistrement (Optimistic UI avec synchronisation Supabase et fallback localStorage).

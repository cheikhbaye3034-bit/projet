# Prompt Antigravity — Système de Notifications (Sama Daara)

## Contexte projet
Tu travailles sur **Sama Daara**, une plateforme SaaS de gestion d'association sénégalaise (Dahira/Kourel).
Stack : Next.js 14 + Tailwind + Supabase (PostgreSQL, Auth, Edge Functions, Cron) + Node.js API REST.

## Objectif
Implémenter un système de notifications automatiques 100% basé sur Supabase (Edge Functions + pg_cron), avec une option de réglage permettant à chaque utilisateur (Responsable/Superviseur et Membre) d'activer ou de désactiver les notifications.

---

## 1. Déclencheurs de notifications (3 types)

1. **Rappel de répétition** : envoyée 1h avant l'heure de début d'une séance de répétition planifiée.
2. **Information épinglée** : envoyée immédiatement à la publication d'une actualité marquée comme épinglée dans le module Informations.
3. **Échéance Kamil** : envoyée 2 jours avant la date limite du cycle Kamil collectif en cours.

---

## 2. Schéma de base de données (Supabase / PostgreSQL)

Crée les tables suivantes :

### Table `notifications`
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, FK vers users/profiles)
- `type` (enum: `repetition_reminder`, `info_pinned`, `kamil_deadline`)
- `title` (text)
- `body` (text)
- `related_entity_id` (uuid, nullable — id de la séance / info / cycle kamil concerné)
- `channel` (enum: `push`, `email`, `in_app`)
- `status` (enum: `pending`, `sent`, `failed`, `skipped`)
- `scheduled_at` (timestamptz)
- `sent_at` (timestamptz, nullable)
- `created_at` (timestamptz, default now())

### Table `notification_preferences`
- `id` (uuid, PK)
- `user_id` (uuid, FK, unique)
- `notifications_enabled` (boolean, default true) — **interrupteur global**
- `repetition_reminder_enabled` (boolean, default true)
- `info_pinned_enabled` (boolean, default true)
- `kamil_deadline_enabled` (boolean, default true)
- `push_enabled` (boolean, default true)
- `email_enabled` (boolean, default false)
- `updated_at` (timestamptz, default now())

> Règle : avant tout envoi, vérifier `notifications_enabled = true` ET le sous-toggle du type concerné. Si `notifications_enabled = false`, aucune notification n'est générée pour cet utilisateur, quel que soit le type.

---

## 3. Edge Functions Supabase à créer

### `check-repetition-reminders` (cron: toutes les 10 min)
- Récupère les séances dont `start_time` est entre 55 et 65 minutes dans le futur.
- Pour chaque membre du kourel concerné, vérifie `notification_preferences`.
- Insère une notification `repetition_reminder` si éligible et pas déjà envoyée pour cette séance.

### `notify-pinned-info` (trigger DB, pas cron)
- Déclenchée par un trigger PostgreSQL `AFTER INSERT OR UPDATE` sur la table `informations` quand `is_pinned = true`.
- Appelle l'Edge Function via `supabase_functions.http_request` (webhook Postgres).
- Génère une notification `info_pinned` pour tous les membres concernés respectant leurs préférences.

### `check-kamil-deadline` (cron: 1x/jour à 08h00)
- Vérifie si la date du jour = `deadline - 2 jours` pour le cycle Kamil actif.
- Génère une notification `kamil_deadline` pour tous les participants n'ayant pas encore terminé leur section, selon préférences.

### `send-notifications` (cron: toutes les 5 min, ou déclenchée après insertion)
- Traite les notifications `status = pending`.
- Envoie via le(s) canal(aux) actif(s) (push via service comme OneSignal/FCM, ou email via Resend/SendGrid).
- Met à jour `status` à `sent` ou `failed`.

---

## 4. Interface Réglages — Toggle Notifications

Ajouter dans la page **Profil/Réglages** (accessible Membre et Responsable) une section "Notifications" :

- Un interrupteur principal **"Activer les notifications"** relié à `notifications_enabled`.
- Si désactivé, griser/masquer les sous-options suivantes :
  - Rappel de répétition (1h avant)
  - Publication d'information épinglée
  - Échéance du cycle Kamil (J-2)
- Chaque changement doit faire un `UPDATE` immédiat (optimistic UI) sur `notification_preferences` via Supabase client, sans bouton "Enregistrer" séparé.
- Afficher un état de chargement bref (spinner ou toast "Préférences mises à jour") après chaque toggle.

### Composant à générer
`components/settings/NotificationSettings.tsx` :
- Utilise `useState` + `useEffect` pour charger les préférences existantes au montage.
- Toggle principal désactive visuellement (opacity-50, pointer-events-none) les toggles secondaires quand `notifications_enabled = false`.
- Design cohérent avec la palette Sama Daara (vert #1F5E43, accent #3F9270, fond #E4F1E9, police Plus Jakarta Sans).

---

## 5. Sécurité (Row Level Security)

- RLS sur `notifications` : un utilisateur ne peut lire que ses propres notifications (`user_id = auth.uid()`).
- RLS sur `notification_preferences` : un utilisateur ne peut lire/modifier que sa propre ligne.
- Les Edge Functions utilisent la clé `service_role` pour insérer/mettre à jour à travers tous les utilisateurs (bypass RLS côté serveur uniquement).

---

## 6. Livrables attendus

1. Migrations SQL (tables + enums + RLS + trigger `info_pinned`).
2. Les 4 Edge Functions (`check-repetition-reminders`, `notify-pinned-info`, `check-kamil-deadline`, `send-notifications`).
3. Configuration des jobs `pg_cron` correspondants.
4. Composant `NotificationSettings.tsx` intégré à la page Réglages/Profil.
5. Hook `useNotificationPreferences()` réutilisable pour lire/écrire les préférences côté client.

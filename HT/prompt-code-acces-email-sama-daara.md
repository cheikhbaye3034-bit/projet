# Prompt Antigravity — Envoi du Code d'Accès par Email (Sama Daara)

## Contexte
Le flux d'inscription est déjà entièrement codé côté frontend et backend, en 4 étapes visibles par l'utilisateur :

1. Choix du rôle (Membre / Responsable)
2. Nom, prénom, numéro de téléphone
3. Adresse email + mot de passe
4. Saisie du code d'accès reçu par email

**Ce qui manque uniquement** : la génération et l'envoi automatique du code d'accès par email, déclenché juste après la validation de l'étape 3 (email + mot de passe).

Stack : Next.js + Supabase (Auth, DB, Edge Functions) + SMTP externe **Resend**.

⚠️ Ne pas toucher aux étapes 1, 2, 3 et 4 déjà fonctionnelles côté UI/logique — implémenter uniquement le mécanisme d'envoi du code.

---

## 1. Pourquoi un SMTP externe (Resend)

Le service email intégré de Supabase (plan gratuit) est limité à seulement 2 emails/heure au total sur tout le projet, en mode "best-effort" sans garantie de livraison, et refuse d'envoyer à des adresses hors de l'équipe du projet. Il faut donc obligatoirement brancher un fournisseur SMTP externe pour que l'envoi fonctionne en conditions réelles.

**Étapes de configuration (à faire une fois, dans le dashboard Supabase) :**
1. Créer un compte gratuit sur resend.com (~3000 emails/mois gratuits).
2. Vérifier un domaine d'envoi (ou utiliser le domaine de test Resend en attendant).
3. Récupérer la clé API Resend.
4. Dans Supabase → **Authentication → Emails → SMTP Settings**, activer "Enable Custom SMTP" et renseigner :
   - Host: `smtp.resend.com`
   - Port: `465` (ou `587`)
   - Username: `resend`
   - Password: la clé API Resend
   - Sender email: l'adresse vérifiée sur Resend

Une fois ce SMTP branché, la limite d'envoi passe à 30 emails/heure minimum (ajustable dans Rate Limits).

---

## 2. Schéma de base de données

### Table `access_codes`
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, FK vers auth.users ou profiles)
- `email` (text)
- `code` (text, 6 chiffres)
- `status` (enum: `pending`, `verified`, `expired`)
- `expires_at` (timestamptz) — ex: `created_at + 15 minutes`
- `created_at` (timestamptz, default now())
- `verified_at` (timestamptz, nullable)

> RLS : un utilisateur ne peut lire/vérifier que son propre code (`user_id = auth.uid()`).

---

## 3. Edge Function `send-access-code`

Déclenchée juste après l'étape 3 (email + mot de passe validés côté client), via un appel `supabase.functions.invoke('send-access-code', { body: { user_id, email } })`.

Logique :
1. Générer un code aléatoire à 6 chiffres.
2. Invalider (status = `expired`) tout code `pending` précédent pour cet utilisateur.
3. Insérer une nouvelle ligne dans `access_codes` avec `status = 'pending'` et `expires_at = now() + 15 min`.
4. Envoyer l'email via l'API Resend (`POST https://api.resend.com/emails`) avec :
   - `from`: adresse vérifiée Sama Daara
   - `to`: l'email du Responsable
   - `subject`: "Votre code d'accès Sama Daara"
   - `html`: template simple affichant le code en gros, avec mention "valide 15 minutes"
5. Retourner `{ success: true }` ou une erreur explicite si l'envoi échoue.

---

## 4. Endpoint de vérification (étape 4)

Fonction appelée quand l'utilisateur saisit le code à l'étape 4 :
1. Chercher le code `pending` correspondant à `user_id` + `code` saisi.
2. Vérifier qu'il n'est pas expiré (`expires_at > now()`).
3. Si valide : `status = 'verified'`, `verified_at = now()`, puis activer définitivement le compte (ex: `profiles.status = 'active'` ou `email_confirmed = true`).
4. Si invalide/expiré : retourner un message d'erreur clair ("Code incorrect" ou "Code expiré, en demander un nouveau").

### Renvoi de code
Prévoir un bouton "Renvoyer le code" côté frontend (déjà existant ou à ajouter) qui rappelle `send-access-code` — avec un cooldown de 60 secondes pour éviter le spam.

---

## 5. Gestion des erreurs

- Si l'envoi Resend échoue (quota dépassé, domaine non vérifié, etc.), logger l'erreur et afficher à l'utilisateur : "Impossible d'envoyer le code, réessayez dans quelques instants."
- Ne jamais bloquer la création du compte si l'email échoue — permettre un nouvel essai depuis l'étape 4 sans repasser par les étapes 1-3.

---

## 6. Livrables attendus

1. Migration SQL : table `access_codes` + RLS.
2. Edge Function `send-access-code` (génération + envoi via Resend).
3. Endpoint/fonction de vérification du code (étape 4).
4. Variable d'environnement `RESEND_API_KEY` configurée dans les secrets Supabase Edge Functions.
5. Template email HTML simple, cohérent avec l'identité visuelle Sama Daara (vert #1F5E43).

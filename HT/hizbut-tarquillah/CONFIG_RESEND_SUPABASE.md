# Guide de Déploiement — Envoi du Code d'Accès par Email (Sama Daara)

Ce guide détaille les étapes simples pour brancher l'envoi d'emails via **Resend** et **Supabase Edge Functions**.

---

## 1. Récupération de la clé API Resend

1. Rendez-vous sur [resend.com](https://resend.com) et connectez-vous ou créez un compte gratuit (3 000 emails/mois gratuits).
2. Dans le menu **API Keys**, cliquez sur **Create API Key**.
3. Donnez un nom (ex: `Sama Daara Production`), choisissez les permissions **Full Access** et copiez votre clé API (commence par `re_...`).
4. *(Optionnel mais recommandé pour la production)* : Dans l'onglet **Domains**, ajoutez votre nom de domaine (ex: `samadaara.sn`) et configurez les entrées DNS (DKIM, SPF).
   > *En mode test sans domaine configuré, vous pouvez utiliser l'adresse d'envoi fournie par défaut : `onboarding@resend.dev`.*

---

## 2. Déploiement de la migration SQL sur Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard/project/alyrucyihkxczwzgoxzu).
2. Rendez-vous dans **SQL Editor**.
3. Cliquez sur **New Query** et copiez-collez l'intégralité du fichier :
   `supabase/migrations/20260908000000_create_access_codes.sql`
4. Cliquez sur **Run**.
   > Cela crée la table `access_codes`, les index, la sécurité RLS et la fonction de vérification `verify_access_code`.

---

## 3. Configuration des secrets dans Supabase Edge Functions

Pour que l'Edge Function `send-access-code` puisse envoyer des emails via Resend :

### Option A : Via le Dashboard Supabase (Recommandé)
1. Allez dans votre projet Supabase → **Project Settings** (icône roue crantée en bas à gauche).
2. Dans le menu latéral, cliquez sur **Edge Functions**.
3. Dans la section **Secrets**, cliquez sur **Add new secret** :
   - Nom : `RESEND_API_KEY`
   - Valeur : *votre_clé_resend_re_...*
4. *(Optionnel)* Ajoutez un deuxième secret si vous avez un domaine personnalisé :
   - Nom : `RESEND_FROM_EMAIL`
   - Valeur : `Sama Daara <contact@votre-domaine.sn>` *(sinon `Sama Daara <onboarding@resend.dev>` par défaut)*.

### Option B : Via la CLI Supabase
Dans votre terminal :
```bash
npx supabase secrets set RESEND_API_KEY=re_votre_cle_ici
```

---

## 4. Déploiement de l'Edge Function `send-access-code`

Depuis le dossier `HT/hizbut-tarquillah` dans votre terminal :
```bash
# 1. Connexion à votre compte Supabase (si pas encore fait)
npx supabase login

# 2. Liaison au projet Supabase
npx supabase link --project-ref alyrucyihkxczwzgoxzu

# 3. Déploiement de la fonction
npx supabase functions deploy send-access-code --no-verify-jwt
```

---

## 5. Configuration SMTP personnalisée dans Supabase Auth (Optionnel)

Si vous souhaitez également router les emails natifs Supabase (réinitialisation mot de passe, confirmation d'inscription) via Resend :

1. Dans le Dashboard Supabase → **Authentication → Email Templates / SMTP Settings**.
2. Activez **Enable Custom SMTP**.
3. Renseignez :
   - **Sender email** : votre adresse expéditeur vérifiée sur Resend (ex: `contact@samadaara.sn` ou `onboarding@resend.dev`)
   - **Sender name** : `Sama Daara`
   - **Host** : `smtp.resend.com`
   - **Port** : `465` (avec SSL) ou `587` (avec TLS)
   - **Username** : `resend`
   - **Password** : votre clé API Resend (`re_...`)
4. Cliquez sur **Save**.

---

## 6. Vérification du bon fonctionnement

1. Lancez l'application en local : `npm run dev`.
2. Allez sur l'écran de connexion / inscription.
3. Renseignez l'étape 1 (Rôle), étape 2 (Identité).
4. À l'étape 3, saisissez votre adresse email et mot de passe, puis cliquez sur **"Valider & Recevoir le code"**.
5. Observez l'étape 4 :
   - L'email cible est affiché dans un badge émeraude.
   - Vous recevez en quelques secondes l'email brandé Sama Daara avec le code à 6 chiffres.
   - Le bouton *"Renvoyer le code"* dispose d'un décompte de 60 secondes anti-spam.
   - La saisie du code valide donne accès instantané à la plateforme avec l'audio officiel.

# 🎯 PROMPT — Développement de la Vue Membre (Hizbut Tarquillah)

## 1. CONTEXTE DU PROJET

Tu travailles sur **Hizbut Tarquillah**, plateforme SaaS de gestion intégrée pour une association religieuse (dahira/kourel), 100% Web Responsive (Mobile First).

**Référence officielle du projet :** Dossier de spécifications "Hizbut Tarquillah — Plateforme SaaS de Gestion Intégrée" (V1.0, statut Validé, août 2026), qui définit :
- **3 pôles fonctionnels cœur** : Répétition & Assiduité, Kamil Collectif (30 Juz'), Fil d'Informations & Actualités
- **Rôles V1 officiels** : Super Admin (accès total) et Superviseur de Kourel (gestion de son/ses kourels, un kourel pouvant avoir plusieurs superviseurs). Le Membre y est en V1 une **fiche gérée par les superviseurs**, sans accès de connexion dans le périmètre officiel.

**Extension produit (au-delà du dossier officiel) :** une **vue Membre avec accès direct** est développée en parallèle, avec un module additionnel de **Cotisation** incluant paiement mobile money (Wave / Orange Money). Cette extension n'est pas encore dans le dossier officiel mais fait partie du produit réel — traite-la comme une fonctionnalité à part entière, cohérente avec le reste de l'app.

**Stack technique (dossier officiel) :**
- Frontend : **Next.js 14** + Tailwind CSS
- Backend/API : Supabase / Node.js (API REST), authentification JWT, Row-Level Security
- Base de données : PostgreSQL
- Stockage médias : Stockage Objet (S3 / Supabase Storage) pour audios et PDF

**Charte visuelle officielle ("Vert & Blanc Islamique Moderne") :**
| Rôle | Couleur | Hex |
|---|---|---|
| Vert profond (principal) | — | `#1F5E43` |
| Vert d'accent (interactif) | — | `#3F9270` |
| Fond clair | — | `#E4F1E9` |
| Typographie | Plus Jakarta Sans | — |

> Si le projet en cours de développement utilise déjà des tokens Tailwind `ht-*` (ex. `ht-emerald`, `ht-fern`, `ht-mist`) proches de cette palette, réutilise-les tels quels pour rester cohérent avec le code existant plutôt que de recréer une palette parallèle.

**Style visuel attendu :** glassmorphism (`backdrop-blur-md`, `bg-white/80`), coins très arrondis (`rounded-2xl`/`rounded-3xl`), gradients emerald/slate sur les banners, ombres douces, animations légères (transitions au hover, `fade-in`).

---

## 1bis. MÉTHODE DE TRAVAIL ATTENDUE

Avant de produire le code, mobilise tes compétences (via le créateur de compétences) pour structurer ton approche :

- **Compétence Planification & Brainstorming** : établis un plan de travail clair — découpe la tâche section par section (Accueil, Répétition, Kamil, Informations, Cotisation, Profil), identifie les dépendances entre composants, les données nécessaires (tables PostgreSQL/Supabase), et les points d'attention (filtrage par membre, responsive, paiement). Présente brièvement ce plan avant de générer le code.
- **Compétence UI/UX** : applique un raisonnement UI/UX à chaque section avant de coder — hiérarchie de l'information, ergonomie mobile-first (zones de tap, lisibilité, feedback visuel), cohérence avec la charte "Vert & Blanc Islamique Moderne", et fluidité des parcours (ex. flux de paiement Wave/Orange Money, sélection des Juz' dans Kamil). Justifie brièvement les choix de mise en page qui ne découlent pas directement des spécifications.

---

## 2. RÔLE À CONSTRUIRE : LE MEMBRE

⚠️ **Règle fondamentale** : l'interface du **Membre** doit être **entièrement distincte** de celle du **Super Admin** et du **Superviseur de Kourel**. Aucun outil de gestion, de pointage ou de supervision réservé à l'encadrement ne doit apparaître côté Membre. Le Membre est en **consultation et action limitée sur ses propres données uniquement**.

Le Membre accède à **6 sections** via une navigation (Sidebar desktop + Drawer/bottom nav mobile) :
1. Accueil
2. Répétition
3. Kamil
4. Informations
5. Cotisation
6. Profil

---

## 3. SPÉCIFICATIONS DÉTAILLÉES PAR SECTION

### 3.1 🏠 Accueil
- Bannière avec **image de fond soignée** (glassmorphism)
- Bloc statistiques d'assiduité personnelles : **présences, absences, retards**, issues de la table `Presence` (filtrée sur `membre_id`), avec code couleur distinct par statut
- Carte "Mon Juz'" : partie du Coran assignée au membre dans le `CycleKamil` en cours (`AssignationPartie` filtrée sur `membre_id`), avec **jours restants avant `date_fin_prevue`**
- Bloc "Informations épinglées" : publications du Fil d'Informations marquées comme épinglées

### 3.2 📖 Répétition
- En-tête : prochaine `SeanceRepetition` planifiée pour le kourel du membre (date, heure_debut)
- Trois sous-sections :
  1. **Khassidas à répéter** : `Khassida` liée à la séance à venir, avec lecture du texte (`texte_url`)
  2. **Audios de référence** : `AudioReference` liée à la khassida, lecteur audio intégré
  3. **Enregistrements** : historique des séances passées avec audio uploadé par le superviseur

### 3.3 📿 Kamil
- Affichage des jours restants avant `date_fin_prevue` du `CycleKamil` en cours
- Le membre peut **choisir entre 1 et 3 parties** (`PartieCoran`, 1 à 30) parmi celles non encore assignées
- Bouton CTA de confirmation ("J'ai terminé la lecture") qui passe le statut de l'`AssignationPartie` à "Terminé" (en attente de validation par le superviseur, qui renseignera `valide_par`)
- Grille des 30 Juz' avec code couleur (À faire / En cours / Validé)

### 3.4 📢 Informations
- Liste des publications du Fil d'Informations (catégories Événement / Annonce / Communiqué), épinglées en tête
- Lecture seule pour le Membre

### 3.5 💰 Cotisation
- Suivi des cotisations du membre : montant assigné (par événement) vs montant payé, avec **barre de progression**
- Historique des différentes assignations de cotisation
- **Paiement en ligne** via **Wave** ou **Orange Money** (sélection du moyen de paiement, flux mobile money)
- **Réception d'un reçu** après chaque paiement (consultable/téléchargeable, historique des reçus)

### 3.6 👤 Profil
- Informations personnelles : nom, prénom, matricule (issues de la fiche `Membre`)
- Statistiques : présences, absences, retards (agrégées depuis `Presence`)
- Bouton de déconnexion

---

## 4. CONTRAINTES TECHNIQUES

- Respecter le schéma relationnel officiel (`Membre`, `Kourel`, `SeanceRepetition`, `Presence`, `CycleKamil`, `PartieCoran`, `AssignationPartie`, informations) : toute donnée affichée doit être filtrée sur le `membre_id` connecté, sans fuite vers d'autres membres ou vers les vues Super Admin/Superviseur
- Authentification Membre : à prévoir en tenant compte du choix officiel du dossier (login par numéro de téléphone), même si ce module n'est pas dans le périmètre du dossier V1 — prévoir un compte de connexion dédié au Membre distinct de celui des superviseurs
- Row-Level Security (Supabase) à anticiper pour restreindre chaque Membre à ses propres données
- Stockage des médias (audios, PDF) via Supabase Storage / S3, jamais en base
- **Paiement Wave / Orange Money** : composant de sélection du moyen de paiement + flux d'initiation (redirection ou modal selon l'API du fournisseur). Si l'intégration API réelle n'est pas encore branchée, prévoir une UI complète avec état "en attente d'intégration backend" clairement identifiable, sans bloquer le reste de l'app. Chaque paiement réussi génère une entrée dans une table dédiée (ex. `PaiementCotisation`) consultable comme historique de reçus
- 100% responsive, mobile-first : navigation adaptée (bottom nav ou drawer), cartes empilées en colonne unique sur petit écran, touch targets suffisamment grands
- Cohérence stricte avec la charte visuelle "Vert & Blanc Islamique Moderne" et le style glassmorphism défini plus haut

---

## 5. LIVRABLE ATTENDU

Génère le code complet et fonctionnel (Next.js/React) pour chacune des 6 sections de la vue Membre, en respectant :
- Le schéma de données et la stack technique du dossier officiel
- La charte visuelle et le style glassmorphism
- Le filtrage strict des données propres au membre connecté
- La responsivité mobile-first
- Le module Cotisation avec paiement Wave/Orange Money

Structure ta réponse section par section (Accueil → Répétition → Kamil → Informations → Cotisation → Profil), en précisant pour chaque composant son emplacement dans l'arborescence du projet, et présente d'abord ton plan (méthode de travail, section 1bis) avant de générer le code.

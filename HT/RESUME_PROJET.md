# 📋 Résumé Détaillé du Projet — SaaS Hizbut Tarquillah

---

## 📌 1. Présentation Générale & Contexte

**Hizbut Tarquillah** est une application web moderne et responsive (SaaS) conçue pour la gestion complète et centralisée d'une association religieuse / dahira / kourel. 

### 🎯 Objectifs principaux
1. **Digitaliser la gestion des membres** et des différents sous-groupes (*kourels*).
2. **Optimiser le suivi de l'assiduité** (présences, retards, motifs d'absence) lors des séances de répétition de Khassida (poèmes religieux).
3. **Piloter collectivement la lecture du Saint Coran (*Kamil*)** découpé en 30 parties (*Juz'*), avec suivi en temps réel à l'échelle de toute l'association.
4. **Centraliser la communication** via un fil d'actualités, d'annonces et d'événements officiels.
5. **Fournir des indicateurs décisionnels (KPIs)** aux responsables via des tableaux de bord analytiques.

---

## 🏗️ 2. Architecture Technique & Choix Technologiques

Le projet est conçu sous la forme d'une application Single Page Application (SPA) ultra-rapide et responsive, adaptée aussi bien aux smartphones qu'aux ordinateurs de bureau.

| Composant | Technologie / Outil | Rôle |
|---|---|---|
| **Frontend Framework** | **React 18** | Structure réactive des composants |
| **Build Tool** | **Vite** | Compilation ultra-rapide et serveur de développement |
| **Styling & Design** | **Tailwind CSS** | Design moderne, palette islamique soignée (Vert émeraude `#144631` / `#1F5E43`, accents Or `#D4AF37`) |
| **Icônes** | **Lucide React** | Iconographie claire et vectorielle |
| **Données & État** | **Context API + Mock Stores** | Gestion globale des états (utilisateurs, membres, répétitions, kamil, news) |
| **Multiplateforme** | **Web Responsive (Mobile-first)** | Utilisable immédiatement dans tout navigateur mobile/desktop sans installation native |

---

## 👥 3. Rôles et Permissions

L'application repose sur un système de droits hiérarchisés :

1. **👑 Super Admin (Responsable Général)** :
   - Accès illimité à tous les modules.
   - Gestion des kourels, attribution des superviseurs, gestion des comptes utilisateurs.
   - Supervision globale des statistiques de l'association.
   - Publication et modération des annonces officielles.

2. **📋 Superviseur de Kourel** :
   - Gestion spécifique de son (ou ses) kourel(s) assigné(s).
   - Pointage des présences/retards en temps réel lors des séances.
   - Enregistrement des séances et upload des fichiers audio / références.
   - Validation de l'avancement des parties du Kamil assignées à ses membres.

3. **👤 Fiche Membre (Consultation)** :
   - Profil individuel contenant les coordonnées, statut, historique d'assiduité et progression Coran.

---

## 🧩 4. Modules Fonctionnels Détaillés

### 4.1 👥 Module Membres & Kourels
- **Annuaire centralisé** : Recherche dynamique, filtrage par kourel, profession, statut (Actif, Inactif, Suspendu).
- **Fiches profils complètes** : Coordonnées téléphoniques, adresse, date d'adhésion, historique de présence et de lecture du Coran.
- **Gestion multi-kourels** : Création de kourels (groupes de répétition) avec support de plusieurs superviseurs simultanés par kourel.

### 4.2 🎵 Module Répétition & Khassidas
- **Planification des séances** : Date, heure, kourel concerné, Khassida travaillée.
- **Ressources audio intégrées** : Lecteur audio pour écouter la version de référence d'une Khassida et possibilité d'uploader l'enregistrement de la répétition.
- **Feuille de pointage interactive** :
  - Statuts disponibles : *Présent*, *En retard* (avec saisie de l'heure exacte), *Absent justifié / non justifié*.
  - Horodatage et traçabilité du superviseur ayant effectué le pointage.
- **Historique & Statistiques d'assiduité** : Taux de présence individuel et par kourel, détection des retards récurrents.

### 4.3 📖 Module Kamil (Suivi Collectif du Coran)
- **Gestion des Cycles de Kamil** : Ouverture d'un cycle global pour l'association avec date d'échéance (ex: 1 ou 2 semaines).
- **Grille interactive des 30 Juz' (Parties)** :
  - Visualisation instantanée par code couleur : 🔴 *À faire*, 🟡 *En cours*, 🟢 *Terminé*.
  - Attribution individuelle d'un Juz' à un membre (manuelle ou intelligente équilibrée entre kourels).
  - Validation de complétion par le superviseur ou l'administrateur.
- **Indicateurs de progression** : Pourcentage global du cycle, temps restant avant échéance, historique des cycles clôturés.

### 4.4 📢 Module Informations & Actualités
- **Flux d'annonces (Feed)** : Publication de communiqués, événements associatifs, rappels de séances.
- **Épinglage** : Mise en avant des communications critiques en tête d'accueil.
- **Tags & Catégories** : Filtrage par type d'information (Événement, Annonce, Communiqué officiel).

### 4.5 📊 Tableau de Bord (Dashboard)
- **KPIs en temps réel** :
  - Nombre total de membres actifs.
  - Nombre de kourels actifs.
  - Taux moyen d'assiduité global du mois.
  - Taux d'achèvement du cycle Kamil en cours.
- **Accès rapides** : Lancement rapide d'un pointage, ajout d'un membre ou consultation des dernières annonces.

---

## 🗂️ 5. Organisation du Dossier de Travail (`PROJET/HT`)

```text
PROJET/
└── HT/
    ├── hizbut-tarquillah/              # Application React/Vite complète
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── layout/             # Header, Sidebar, Navigation
    │   │   │   ├── modules/            # Écrans (Accueil, Membres, Répétitions, Kamil, Info, Dashboard)
    │   │   │   └── ui/                 # Boutons, Modales, Badges, Tables
    │   │   ├── context/                # Contexts React (Auth, Data, State)
    │   │   ├── mock/                   # Données de démonstration réalistes
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── package.json
    │   └── vite.config.js
    │
    ├── Dossier_Projet_Hizbut_Tarquillah.pdf  # Dossier de présentation officiel exporté
    ├── dossier_projet_ht.html               # Version HTML print-ready du dossier de présentation
    ├── plan-implementation-hizbut-tarquillah.md # Cahier des charges et spécifications initiales
    ├── prompts-antigravity-hizbut-tarquillah.md # Prompts de guidage IA
    ├── RESUME_PROJET.md                     # Ce document de synthèse complet
    ├── README.md                            # Instructions et lien direct
    └── Lien_Projet_HT.url                   # Raccourci 1-clic d'ouverture vers le navigateur
```

---

## 🚀 6. Guide de Démarrage et Utilisation

### Lancer l'application localement
1. Ouvrez un terminal dans le dossier du projet :
   ```powershell
   cd "c:\Users\Cheikh khady\OneDrive\Documents\PROJET\HT\hizbut-tarquillah"
   ```
2. Installez les dépendances (si ce n'est pas déjà fait) :
   ```powershell
   npm install
   ```
3. Démarrez le serveur de développement :
   ```powershell
   npm run dev
   ```
4. Accédez à l'application dans votre navigateur :
   👉 **`http://localhost:3000/`** (ou `http://localhost:5173/` selon la configuration du port).

---

## 🔮 7. Évolutions Futures Possibles (Roadmap V2)

- **Espace Membre dédié** : Accès personnel par code ou mot de passe pour consulter son statut et marquer soi-même sa partie du Coran lue.
- **PWA (Progressive Web App)** : Installation comme une application mobile sur Android/iOS et mise en cache hors-ligne.
- **Notifications Automatisées** : Rappels automatiques des séances et des échéances du Kamil par SMS ou WhatsApp.
- **Export de rapports** : Téléchargement direct des bilans de présence et des statistiques en PDF et Excel.

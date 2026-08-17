# Plan d'implémentation — SaaS de gestion « Hizbut Tarquillah »

## 0. Contexte et objectif du document

Ce document est une **spécification fonctionnelle et technique** destinée à être donnée directement à un agent de développement IA (Antigravity) pour générer l'application. Il décrit le périmètre, le modèle de données, l'architecture et les écrans à produire.

**Nature du projet** : plateforme web (responsive, utilisable sur mobile via navigateur — pas d'appli native) pour la gestion d'une association religieuse (dahira/kourel) nommée **Hizbut Tarquillah**. Elle gère les membres, le suivi des présences/retards, les séances de répétition de khassida, le suivi collectif de la lecture du Coran (Kamil), et la diffusion d'informations/actualités.

---

## 1. Vision produit

Un outil unique pour que les responsables de l'association :
- gèrent l'annuaire des membres,
- organisent et suivent les séances de répétition par kourel (groupe),
- suivent l'assiduité (présences/retards) de façon fiable même avec plusieurs kourels et plusieurs superviseurs,
- pilotent la progression collective du Kamil (lecture complète du Coran en 30 parties),
- communiquent les actualités de l'association.

**Contrainte technique clé** : 100% web responsive (une seule base de code, accessible depuis n'importe quel navigateur, mobile ou desktop). Pas d'app native dans un premier temps.

---

## 2. Rôles et utilisateurs

| Rôle | Description | Droits principaux |
|---|---|---|
| **Super Admin** | Responsable général de l'association | Accès total, gestion des rôles, configuration des kourels, validation des contenus |
| **Superviseur de kourel** | Responsable d'un kourel spécifique (il peut y en avoir plusieurs, un par kourel ou plusieurs par kourel) | Pointage présence/retard de son/ses kourel(s), création de séances, upload audio/enregistrements, saisie progression Kamil de son groupe |
| **Membre** | Personne inscrite dans l'association | **V1 : pas de compte de connexion.** Le membre est une fiche gérée par les superviseurs/admin (nom, présence, progression Kamil), sans accès à l'appli lui-même. L'ouverture d'un accès membre (consultation de son profil/historique) est prévue pour une version ultérieure |
| **Secrétaire / Rédacteur info** | Optionnel — peut être fusionné avec Super Admin en V1 | Publication des actualités/informations |

**Point important** : un kourel peut avoir **plusieurs superviseurs** simultanément → il faut une table de liaison many-to-many `Superviseur ↔ Kourel`, avec journal (log) de qui a pointé quoi, pour tracer les modifications en cas de désaccord entre superviseurs.

---

## 3. Modèle de données (entités principales)

### 3.1 Membre
```
Membre {
  id
  nom
  prenom
  adresse
  telephone
  profession        // enum: Élève, Étudiant, Salarié, Sans emploi, Autre (+ champ libre)
  date_naissance     (optionnel)
  date_adhesion
  photo              (optionnel)
  statut             // Actif / Inactif / Suspendu
  kourel_id          (FK -> Kourel, un membre appartient à un kourel principal)
  // Pas de user_id en V1 : le membre n'a pas de compte de connexion,
  // c'est une fiche gérée par les superviseurs/admin. Champ à ajouter
  // si un accès membre est ouvert dans une version ultérieure.
}
```

### 3.2 Kourel
```
Kourel {
  id
  nom                // ex: Kourel 1, Kourel Miftahoul Mouna...
  description
  date_creation
}
SuperviseurKourel {   // table de liaison many-to-many
  id
  superviseur_id (FK -> User)
  kourel_id (FK -> Kourel)
}
```

### 3.3 Module Répétition
```
Khassida {
  id
  titre
  auteur             (ex: Cheikh Ahmadou Bamba)
  texte_ou_fichier    // PDF/texte de la khassida
  niveau_difficulte   (optionnel)
}

AudioReference {
  id
  khassida_id (FK)
  fichier_audio_url
  duree
  uploaded_by (FK -> User)
}

SeanceRepetition {
  id
  kourel_id (FK)
  date
  heure_debut
  heure_fin
  khassida_id (FK)          // khassida travaillée ce jour
  audio_reference_id (FK, optionnel)
  superviseur_id (FK -> qui a créé/animé la séance)
  statut             // Planifiée / En cours / Terminée / Annulée
  notes
}

EnregistrementSeance {
  id
  seance_id (FK)
  fichier_audio_url        // enregistrement de la répétition elle-même
  uploaded_by (FK)
  date_upload
}

Presence {
  id
  seance_id (FK)
  membre_id (FK)
  statut             // Présent / Absent / En retard
  heure_arrivee       (si retard)
  justifie            (bool, motif optionnel)
  pointe_par (FK -> superviseur qui a fait le pointage)
  date_pointage
}
```
→ La table `Presence` alimente directement les statistiques d'assiduité par membre, par kourel, par période.

### 3.4 Module Kamil (Coran — 30 parties, suivi collectif à l'échelle de l'association)
```
CycleKamil {
  id
  // Pas de kourel_id : le cycle est global, un seul Kamil en cours pour toute l'association à la fois.
  // Les 30 parties sont réparties entre des membres de kourels différents.
  date_debut
  date_fin_prevue             // ex: +1 semaine ou +2 semaines
  statut                      // En cours / Terminé
}

PartieCoran {
  id
  numero              // 1 à 30 (Juz')
  nom                 (optionnel, nom arabe/wolof de la partie)
}

AssignationPartie {
  id
  cycle_kamil_id (FK)
  partie_id (FK -> PartieCoran, 1 à 30)
  membre_id (FK)              // le membre à qui la partie est assignée
  statut               // À faire / En cours / Terminé
  date_completion
  valide_par (FK -> superviseur, validation de la lecture)
}
```
→ Puisque le suivi est **collectif** (le groupe se répartit les 30 parties), l'écran clé est une **grille de 30 cases** (une par Juz'), chacune assignée à un membre, avec statut coloré (à faire / en cours / fait). Statistique = % de parties complétées sur le cycle, temps moyen de complétion, historique des cycles précédents.

### 3.5 Module Informations / Actualités
```
Information {
  id
  titre
  contenu             // texte riche
  image (optionnel)
  categorie           // Actualité / Annonce / Événement / Communiqué
  date_publication
  auteur_id (FK)
  epingle             (bool, pour mettre en avant)
  visible_a_tous      (bool, ou ciblage par kourel)
}
```

---

## 4. Détail fonctionnel des 3 sections

### Section 1 — Répétition
- Calendrier des séances par kourel (jours/heures récurrents configurables, ex: tous les mardis 20h)
- Fiche de séance : khassida du jour + audio de référence à écouter/répéter
- Upload de l'enregistrement de la séance par le superviseur
- **Pointage présence/retard** par le(s) superviseur(s) du kourel concerné, avec horodatage
- Historique des séances passées avec accès aux enregistrements
- **Tableau de bord statistiques** :
  - Taux de présence par membre / par kourel / global
  - Évolution du taux de présence dans le temps (courbe)
  - Classement des retardataires récurrents
  - Répertoire des khassida déjà travaillées vs à venir

### Section 2 — Kamil (Coran)
- Un seul cycle Kamil actif à la fois, **global à toute l'association** (pas par kourel)
- Création d'un nouveau cycle Kamil (date début, échéance : 1 ou 2 semaines)
- Répartition des 30 parties entre des membres de l'ensemble des kourels (assignation manuelle par un admin/superviseur, ou génération automatique équilibrée qui pioche dans tous les kourels)
- Chaque superviseur peut marquer/valider une partie comme « en cours » puis « terminée » pour les membres qu'il supervise
- **Vue grille 30 cases** avec code couleur, visible par tous, indiquant qui est assigné à quelle partie (utile pour que chacun sache où en est le cycle collectif)
- Statistiques : cycles complétés, temps moyen par cycle, membres les plus/moins actifs, historique des cycles, taux de respect de l'échéance (1 ou 2 semaines)

### Section 3 — Informations / Actualités
- Fil d'actualités façon feed, avec épinglage des annonces importantes
- Catégorisation (Événement, Annonce, Communiqué)
- Visible par tous les membres connectés (page d'accueil de l'appli)

---

## 5. Fonctionnalités transverses

- **Authentification** : login/mot de passe (+ option téléphone comme identifiant, courant au Sénégal), gestion des rôles (Super Admin, Superviseur, Membre)
- **Recherche & filtres** : rechercher un membre par nom, filtrer par kourel/profession/statut
- **Notifications** (dès la V1) : rappel de séance à venir, rappel Kamil non terminé/échéance proche, nouvelle actualité publiée — par email ou notification web push. Ciblage : un superviseur reçoit les rappels pour son/ses kourel(s), un admin reçoit tout, un membre (si accès prévu plus tard) reçoit ce qui le concerne
- **Export de données** : export CSV/PDF de la liste des membres et des statistiques de présence
- **Journal d'activité (audit log)** : qui a pointé quoi, qui a modifié quoi — important vu qu'il y a plusieurs superviseurs par kourel
- **Responsive design** : mobile-first, l'usage principal se fera sûrement depuis un téléphone via navigateur

---

## 6. Architecture technique recommandée

- **Frontend** : application web responsive — React (ou Next.js pour avoir SSR + facilité de déploiement) + Tailwind CSS
- **Backend** : Node.js (Express/NestJS) ou Django/FastAPI selon préférence — API REST
- **Base de données** : PostgreSQL (relationnel, adapté au modèle décrit ci-dessus avec beaucoup de relations)
- **Stockage fichiers** (audio, images, PDF khassida) : service de stockage objet (S3-compatible) — ne pas stocker les fichiers audio en base
- **Authentification** : JWT + gestion de rôles (RBAC)
- **Hébergement** : pensé pour un déploiement simple/économique (Vercel/Render/Railway pour commencer, migration possible plus tard)

---

## 7. Roadmap de développement (phases)

### Phase 1 — MVP (socle)
- Gestion des membres (CRUD complet), pas de compte de connexion pour eux
- Gestion des kourels + assignation superviseurs (accès réservé Admin/Superviseur)
- Authentification et rôles (Super Admin, Superviseur)
- Séances de répétition + pointage présence/retard simple
- Statistiques de présence de base
- Notifications de base (rappel de séance) par email/push, ciblées par kourel

### Phase 2 — Module Kamil
- Cycle Kamil unique et global à toute l'association, grille des 30 parties, assignation et suivi
- Statistiques Kamil
- Notification de rappel d'échéance Kamil

### Phase 3 — Enrichissement
- Upload et lecture d'audio (khassida de référence + enregistrements de séance)
- Module Informations/Actualités complet + notification de publication
- Export CSV/PDF

### Phase 4 — Confort et fiabilité
- Journal d'audit détaillé
- Tableaux de bord avancés (comparaison entre kourels, tendances)
- Ouverture éventuelle d'un accès membre (consultation de son profil/historique)

---

## 8. Prompt-résumé à donner à Antigravity

> Construis une application web responsive (une seule base de code, pas d'app native) de gestion pour une association religieuse appelée « Hizbut Tarquillah ». Accès réservé en V1 aux Super Admins et Superviseurs (les membres n'ont pas de compte, ce sont de simples fiches). L'application a 3 sections principales : (1) Répétition — gestion des séances de répétition par kourel avec khassida, audio de référence, enregistrements, pointage présence/retard fait par un ou plusieurs superviseurs par kourel, et statistiques d'assiduité ; (2) Kamil — suivi collectif et **global à toute l'association** (un seul cycle actif à la fois, pas un par kourel) de la lecture du Coran en 30 parties (Juz'), avec cycles de 1-2 semaines, répartition des parties entre membres de différents kourels, validation par superviseur, et statistiques de progression ; (3) Informations — fil d'actualités de l'association. Inclure un système de notifications dès la V1 (rappel de séance, rappel d'échéance Kamil, nouvelle actualité), ciblées selon le rôle et le kourel de l'utilisateur. Gère aussi un annuaire des membres (nom, prénom, adresse, téléphone, profession) rattachés à un kourel. Utilise le modèle de données et l'architecture détaillés dans ce document [joindre les sections 3 et 6].

---

## 9. Points déjà tranchés

- **Kamil** : un seul cycle global pour toute l'association (pas un par kourel).
- **Notifications** : incluses dès la V1 (Phase 1/2).
- **Accès membres** : réservé aux Superviseurs/Admin en V1 ; les membres sont de simples fiches sans compte de connexion.

## 10. Points encore ouverts (à trancher si besoin avant de lancer)

- Génération automatique de la répartition des 30 parties du Kamil (équilibrée entre kourels), ou assignation 100% manuelle par l'admin ?
- Canal de notification préféré : email, SMS (WhatsApp/Mobile Money étant déjà des habitudes locales), ou notification web push ?
- Un même superviseur peut-il gérer plusieurs kourels à la fois, ou un superviseur = un seul kourel ?

# Prompts pour Antigravity — SaaS Hizbut Tarquillah

Ce document reprend la structure de ton prompt original (architecte → dashboard → pages suivantes → design system), adaptée à ton projet réel : gestion de membres, présences, répétitions de khassida, Kamil collectif et informations — pas de facturation.

À utiliser dans l'ordre : **A** une seule fois au début (optionnel), puis **B**, puis **C**, puis **D**.

---

## A. Prompt architecte (à donner à Claude si tu veux regénérer/affiner le plan)

Tu peux sauter cette étape puisque tu as déjà le document **Plan-implementation-Hizbut-Tarquillah.docx**. Garde ce prompt sous le coude si tu veux qu'un modèle affine encore le plan avant de construire :

```
Tu es un architecte logiciel et designer senior de classe mondiale avec plus
de 15 ans d'experience dans la conception d'applications SaaS de haute
qualite. Tu as concu des produits pour des associations et organisations
de premier plan.

On veut construire un SaaS full-stack de gestion pour une association
religieuse senegalaise appelee Hizbut Tarquillah. C'est important de bien
faire les choses car de vrais responsables d'association vont l'utiliser
au quotidien pour suivre leurs membres. En tant qu'utilisateur (Super
Admin ou Superviseur de kourel), on veut pouvoir :

- Voir un dashboard avec les statistiques cles (taux de presence, membres
  actifs, progression du cycle Kamil en cours, prochaine seance)
- Gerer l'annuaire des membres (nom, prenom, adresse, telephone,
  profession, kourel de rattachement)
- Creer des seances de repetition par kourel, avec khassida du jour, audio
  de reference, et pointer presence / retard / absence de chaque membre
- Suivre un cycle Kamil global a toute l'association : repartition des
  30 parties du Coran entre des membres de differents kourels, avec suivi
  de progression (a faire / en cours / termine)
- Publier des informations et actualites de l'association (evenements,
  annonces, communiques), avec possibilite d'epingler

Le SaaS doit utiliser Next.js 14 (App Router), Supabase pour la base de
donnees et l'authentification, et Tailwind CSS. On deploiera sur Vercel.

En V1, l'application est reservee aux Super Admins et Superviseurs de
kourel (les membres sont de simples fiches, pas de compte de connexion).
Un kourel peut avoir plusieurs superviseurs.

Je definirai l'UX via des captures d'ecran, donc ne t'inquiete pas des
details de design pour l'instant. Le flux sera :

1. D'abord, on construira les fonctionnalites principales en utilisant des
   captures d'ecran comme inspiration de design.
2. Ensuite, on le rendra interactif avec des donnees locales et on
   s'assurera que les routes fonctionnent.
3. Ensuite, on ajoutera la base de donnees avec Supabase.
4. Ensuite, on ajoutera l'authentification (Super Admin / Superviseur).
5. Finalement, on fera un passage de bout en bout (securite, tests,
   deploiement).

Reflechis extremement fort et genere un plan d'implementation complet et
detaille, avec le modele de donnees suivant comme base :

[COLLER ICI LES SECTIONS 3 ET 6 DU DOCUMENT Plan-implementation-Hizbut-Tarquillah.docx]

Une fois que tu en as developpe un qui est solide, reviens ici et je te
fournirai les captures d'ecran d'inspiration.
```

---

## B. Prompt Antigravity — Dashboard + Sidebar (premier prompt, avec captures jointes)

C'est le premier prompt à donner à Gemini dans Antigravity, avec le plan (docx ou export du chat) + des captures Dribbble si tu en as trouvé (cherche "green SaaS dashboard", "nonprofit dashboard UI", "attendance tracker dashboard").

```
Tu es un designer et developpeur front-end de classe mondiale avec plus de
15 ans d'experience dans la creation d'interfaces SaaS haute qualite,
responsives et primees sur Dribbble et Awwwards.

Voici le plan d'implementation complet pour notre SaaS de gestion
d'association religieuse (Hizbut Tarquillah) :

[COLLER ICI LE PLAN D'IMPLEMENTATION — sections 1 a 7]

Et voici les captures d'ecran d'inspiration pour le design :

[JOINDRE ICI LES CAPTURES D'ECRAN, S'IL Y EN A]

Commence par construire le Dashboard et la sidebar de navigation en
suivant le plan d'implementation.

Regles a suivre :

- Utilise Next.js 14 (App Router) et Tailwind CSS.
- Palette de couleurs : blanc majoritaire, avec des degrades de vert en
  accent (vert profond #1F5E43 pour les elements actifs/CTA, vert moyen
  #3F9270 pour les accents secondaires, vert tres clair #E4F1E9 / #DCEEE2
  pour les fonds legers). Pas de fond sombre plein, le blanc doit dominer
  la composition.
- Typographie : "Plus Jakarta Sans" pour les titres et les chiffres cles
  (bold/extrabold), "Inter" pour le texte courant.
- Sidebar en blanc avec bordure fine, navigation : Tableau de bord,
  Membres, Repetition, Kamil, Informations. Item actif = fond vert tres
  clair + texte/icone vert fonce.
- Cartes blanches avec bordure fine claire et ombre douce (pas de bordures
  epaisses ni de couleurs vives en fond de carte).
- Dates au format jour/mois/annee.
- Statuts de presence avec badges colores : vert pour present, orange/
  ambre pour en retard, rouge/terracotta discret pour absent.
- Design responsive : sidebar sur desktop, hamburger sur mobile.
- Le code doit etre propre et bien structure.

Construis le dashboard complet avec :
- la sidebar de navigation,
- 4 cartes de statistiques (taux de presence global, membres actifs,
  progression du cycle Kamil en cours sur 30, retards ce mois),
- une courbe (line/area chart) montrant l'evolution du taux de presence
  sur les 8 dernieres seances,
- un graphique en anneau (donut chart) montrant la repartition des 30
  parties du Kamil (termine / en cours / a faire),
- un graphique en barres comparant l'assiduite entre les differents
  kourels,
- une carte "derniere actualite" mettant en avant l'information epinglee.

Pour l'instant, utilise des donnees fictives codees en dur. Pas de base de
donnees encore. Une fois que j'ai valide le design, on passera aux autres
pages.
```

---

## C. Prompt Antigravity — Pages suivantes

À utiliser une fois le dashboard validé, pour enchaîner sur les autres écrans.

```
Le dashboard est valide. Maintenant, construis les pages suivantes en
gardant exactement le meme style de design (blanc majoritaire, degrades
de vert, Plus Jakarta Sans + Inter, cartes avec ombre douce) :

PAGE MEMBRES :
- Tableau de tous les membres : nom, prenom, telephone, profession, kourel
  de rattachement, statut (actif/inactif/suspendu)
- Filtres par kourel et par profession
- Barre de recherche par nom
- Bouton "Ajouter un membre" ouvrant un formulaire (nom, prenom, adresse,
  telephone, profession, date d'adhesion, kourel)
- Clic sur un membre ouvre sa fiche detaillee avec : ses informations,
  son historique de presence (liste des dernieres seances + taux), et sa
  progression sur le cycle Kamil en cours si une partie lui est assignee

PAGE REPETITION :
- Selecteur de kourel en haut de page
- Calendrier ou liste des seances passees et a venir pour le kourel
  selectionne
- Fiche de la seance du jour : khassida travaillee, bouton pour ecouter
  l'audio de reference, zone pour deposer l'enregistrement de la seance
- Tableau de pointage : liste des membres du kourel avec colonnes heure
  d'arrivee et statut (Present / En retard / Absent), modifiable par le
  superviseur en un clic
- Mini graphique de tendance de la presence pour ce kourel sur les
  dernieres seances

PAGE KAMIL :
- Bandeau avec le cycle en cours : date de debut, echeance, jours
  restants
- Grille des 30 parties (Juz'), affichees en cases avec le nom du membre
  assigne et un code couleur (termine / en cours / a faire)
- Bouton pour marquer une partie comme "en cours" puis "terminee"
  (reserve aux superviseurs)
- Graphique en barres montrant l'historique des 6 derniers cycles avec
  leur taux de completion a l'echeance
- Bouton "Nouveau cycle" pour lancer une nouvelle repartition des 30
  parties (date de debut, echeance a 1 ou 2 semaines, assignation
  manuelle ou automatique)

PAGE INFORMATIONS :
- Fil d'actualites de l'association, triees par date (plus recent en
  premier)
- Chaque carte affiche : categorie (Evenement / Annonce / Communique),
  titre, extrait, date, et un badge "Epingle" si applicable
- Bouton "Publier une information" ouvrant un formulaire (titre, contenu,
  categorie, image optionnelle, epingler ou non)

Garde les donnees fictives. Meme style que le dashboard.
```

---

## D. Prompt Antigravity — Page de connexion

L'application est réservée aux Super Admins/Superviseurs en V1, donc pas de landing page publique nécessaire pour l'instant — juste un écran de connexion soigné.

```
Construis la page de connexion (login) de l'application, dans le meme
style de design que le reste (blanc majoritaire, degrades de vert, Plus
Jakarta Sans + Inter).

CONTENU :
- Logo/monogramme "HT" dans un badge en degrade de vert, nom "Hizbut
  Tarquillah" et sous-titre "Espace superviseurs & administration"
- Formulaire simple : identifiant (email ou telephone) + mot de passe
- Bouton de connexion en vert plein, pleine largeur
- Lien "Mot de passe oublie ?"
- Pas d'inscription libre : les comptes superviseurs sont crees par le
  Super Admin depuis le panneau d'administration (pas de bouton "Creer un
  compte" sur cette page)

DESIGN :
- Layout centre sur la page, carte blanche avec ombre douce sur fond tres
  legerement teinte de vert (#F7FBF8)
- Coins arrondis genereux, espacement genereux
- Design responsive, mobile-first

REGLES TECHNIQUES :
- Next.js 14 (App Router), Tailwind CSS
- Pour l'instant, simule la connexion (pas de Supabase branche encore) :
  au clic sur "Se connecter", redirige simplement vers le dashboard
```

---

## Rappel — palette et typographie de référence

À copier-coller si Antigravity a besoin qu'on lui redonne les tokens de design en cours de route :

| Token | Valeur | Usage |
|---|---|---|
| `white` | `#FFFFFF` | Fond des cartes, sidebar |
| `page` | `#F7FBF8` | Fond général de l'app |
| `mist` | `#EFF6F1` | Fonds légers, hover |
| `mint` | `#DCEEE2` | Accent doux, badges |
| `mintDeep` | `#C3E3D0` | État "en cours" |
| `sage` | `#7FAE94` | Texte secondaire sur clair |
| `fern` | `#3F9270` | Vert primaire interactif |
| `emerald` | `#1F6B4B` | Vert profond, titres, actifs |
| `ink` | `#16241C` | Texte principal |
| `inkSoft` | `#66796E` | Texte secondaire |
| `line` | `#E6EFEA` | Bordures fines |
| `amber` | `#C08A3E` | Statut "retard" |
| `clay` | `#C06152` | Statut "absent" |

**Polices** : Plus Jakarta Sans (titres, chiffres) + Inter (texte courant).

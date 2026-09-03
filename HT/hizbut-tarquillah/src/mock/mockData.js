// Mock / Initial Clean data pour Sama daara (Hizbut Tarquillah)

export const INITIAL_ZONES = [
  { id: 'z1', nom: 'Zone Touba Central', code: 'Z-TOUBA-01', description: 'Touba Mosquée, Darou Minam, Guédé Bousso, Dianatoul Mahwa', responsable: 'Serigne Modou Kara', couleur: 'emerald' },
  { id: 'z2', nom: 'Zone Dakar & Littoral', code: 'Z-DKR-02', description: 'Mermoz, Yoff, Sacré-Cœur, Rufisque, Liberté 6', responsable: 'Cheikh Ahmadou Ndiaye', couleur: 'indigo' },
  { id: 'z3', nom: 'Zone Thiès & Baol', code: 'Z-THIES-03', description: 'Thiès Dixième, Diourbel, Khombole', responsable: 'Serigne Fallou Seck', couleur: 'amber' },
  { id: 'z4', nom: 'Zone Nord & Fleuve', code: 'Z-NORD-04', description: 'Saint-Louis Balacos, Louga, Matam', responsable: 'Mouhamadou Bamba Sow', couleur: 'sky' },
  { id: 'z5', nom: 'Zone Saloum & Sud', code: 'Z-SALOUM-05', description: 'Kaolack Medina Baye, Fatick, Ziguinchor', responsable: 'Sokhna Mame Diarra', couleur: 'rose' },
];

export const INITIAL_KOURELS = [
  { id: 'k1', nom: 'Kourel 1 — Miftahoul Mouna', description: 'Groupe principal des chanteurs de khassidas', date_creation: '2020-01-15', superviseurs: ['Serigne Modou Kara', 'Cheikh Ahmadou Ndiaye'] },
  { id: 'k2', nom: 'Kourel 2 — Fathou Rahmane', description: 'Section récitation et mémorisation', date_creation: '2021-03-10', superviseurs: ['Serigne Fallou Seck'] },
  { id: 'k3', nom: 'Kourel 3 — Khidmatoul Khadim', description: 'Section jeunes et apprentis', date_creation: '2022-06-01', superviseurs: ['Mouhamadou Bamba Sow'] },
  { id: 'k4', nom: 'Kourel 4 — Nurou Darayni', description: 'Section dames et accompagnatrices', date_creation: '2023-02-18', superviseurs: ['Sokhna Mame Diarra'] },
];

export const INITIAL_SECTEURS = [
  { id: 'sec1', nom: 'Commission Organisation & Logistique', code: 'ORG-LOG', description: 'Gestion des convois, installation des cérémonies et organisation générale.' },
  { id: 'sec2', nom: 'Récitation & Kourel', code: 'REC-KOUR', description: 'Chant et déclamation des Khassidas et lecture du Saint Coran.' },
  { id: 'sec3', nom: 'Commission Restauration & Berndé', code: 'RESTO', description: 'Préparation et distribution des repas pour les évènements.' },
  { id: 'sec4', nom: 'Accueil & Protocole', code: 'PROT-ACC', description: 'Accueil des dignitaires, gestion des invités et discipline.' },
  { id: 'sec5', nom: 'Service Technique, Son & Médias', code: 'TECH-MEDIA', description: 'Gestion de la sonorisation, des retransmissions et enregistrements.' },
  { id: 'sec6', nom: 'Secrétariat & Trésorerie', code: 'ADMIN-FIN', description: 'Gestion administrative, collecte des cotisations et registres.' },
];

export const INITIAL_MEMBRES = [
  { id: 'm1', nom: 'MBACKE', prenom: 'Serigne Cheikh', telephone: '+221 77 123 45 67', adresse: 'Touba Mosquée, Quartier Darou Minam', profession: 'Salarié', date_adhesion: '2021-02-10', statut: 'Actif', kourel_id: 'k1', zone_id: 'z1', secteur_id: 'sec2', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm2', nom: 'NDIAYE', prenom: 'Cheikh Ahmadou', telephone: '+221 78 234 56 78', adresse: 'Dakar, Mermoz Pyrotechnie', profession: 'Étudiant', date_adhesion: '2020-05-12', statut: 'Actif', kourel_id: 'k1', zone_id: 'z2', secteur_id: 'sec1', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm3', nom: 'DIOP', prenom: 'Moustapha', telephone: '+221 70 345 67 89', adresse: 'Thiès, Quartier Dixième', profession: 'Salarié', date_adhesion: '2022-01-20', statut: 'Actif', kourel_id: 'k1', zone_id: 'z3', secteur_id: 'sec5', cotisation_statut: 'En retard', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Juin 2026' },
  { id: 'm4', nom: 'FALL', prenom: 'Ibrahima', telephone: '+221 76 456 78 90', adresse: 'Saint-Louis, Balacos', profession: 'Élève', date_adhesion: '2023-04-15', statut: 'Actif', kourel_id: 'k2', zone_id: 'z4', secteur_id: 'sec2', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm5', nom: 'SOW', prenom: 'Mouhamadou Bamba', telephone: '+221 77 567 89 01', adresse: 'Touba, Guédé Bousso', profession: 'Salarié', date_adhesion: '2019-11-03', statut: 'Actif', kourel_id: 'k2', zone_id: 'z1', secteur_id: 'sec3', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Juillet 2026' },
  { id: 'm6', nom: 'GUEYE', prenom: 'Khadim', telephone: '+221 78 678 90 12', adresse: 'Dakar, Sacré-Cœur 3', profession: 'Étudiant', date_adhesion: '2021-08-25', statut: 'Actif', kourel_id: 'k2', zone_id: 'z2', secteur_id: 'sec4', cotisation_statut: 'En retard', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Mai 2026' },
  { id: 'm7', nom: 'SECK', prenom: 'Abdoulaye', telephone: '+221 70 789 01 23', adresse: 'Kaolack, Medina Baye', profession: 'Sans emploi', date_adhesion: '2022-09-14', statut: 'Inactif', kourel_id: 'k3', zone_id: 'z5', secteur_id: 'sec1', cotisation_statut: 'En retard', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Avril 2026' },
  { id: 'm8', nom: 'SY', prenom: 'Serigne Fallou', telephone: '+221 76 890 12 34', adresse: 'Touba, Dianatoul Mahwa', profession: 'Autre', date_adhesion: '2020-03-30', statut: 'Actif', kourel_id: 'k3', zone_id: 'z1', secteur_id: 'sec6', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm9', nom: 'LO', prenom: 'Ousmane', telephone: '+221 77 901 23 45', adresse: 'Dakar, Yoff APECSY', profession: 'Salarié', date_adhesion: '2021-12-01', statut: 'Actif', kourel_id: 'k3', zone_id: 'z2', secteur_id: 'sec3', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm10', nom: 'CISSE', prenom: 'Mame Diarra', telephone: '+221 78 012 34 56', adresse: 'Rufisque, HLM 2', profession: 'Étudiant', date_adhesion: '2023-01-10', statut: 'Actif', kourel_id: 'k4', zone_id: 'z2', secteur_id: 'sec4', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm11', nom: 'SARR', prenom: 'Fatou Bintou', telephone: '+221 70 123 45 67', adresse: 'Dakar, Liberté 6 Extension', profession: 'Salarié', date_adhesion: '2022-05-18', statut: 'Actif', kourel_id: 'k4', zone_id: 'z2', secteur_id: 'sec6', cotisation_statut: 'À jour', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Août 2026' },
  { id: 'm12', nom: 'KANE', prenom: 'Babacar', telephone: '+221 76 234 56 78', adresse: 'Diourbel, Thierno Kandji', profession: 'Élève', date_adhesion: '2023-09-02', statut: 'Suspendu', kourel_id: 'k1', zone_id: 'z3', secteur_id: 'sec5', cotisation_statut: 'En retard', cotisation_montant: '5 000 FCFA', dernier_paiement: 'Février 2026' },
];

// Clean initial Khassidas list (vide pour tester vos propres imports réels)
export const INITIAL_KHASSIDAS = [];

// Clean initial Audio list (vide pour tester vos propres imports réels)
export const INITIAL_SONS_AUDIO = [];

// Clean initial Séances list
export const INITIAL_SEANCES = [];

// Clean initial Kamil cycle avec 30 Jukis disponibles / libres
export const INITIAL_KAMIL_CYCLE = {
  id: 'cycle-1',
  numero_cycle: 1,
  date_debut: new Date().toISOString().split('T')[0],
  date_fin_prevue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  statut: 'En cours',
  duree_semaines: 2,
  assignations: Array.from({ length: 30 }, (_, i) => ({
    juz: i + 1,
    membre_id: null,
    nom_juz: `Juz' ${i + 1}`,
    statut: 'À faire',
    date_validee: ''
  }))
};

export const PAST_KAMIL_CYCLES = [];

export const INITIAL_INFORMATIONS = [];

export const ASSIDUITE_TREND_DATA = [];

export const KOURELS_COMPARISON_DATA = [
  { name: 'Kourel 1', taux: 100, membreCount: 4 },
  { name: 'Kourel 2', taux: 100, membreCount: 3 },
  { name: 'Kourel 3', taux: 100, membreCount: 3 },
  { name: 'Kourel 4', taux: 100, membreCount: 2 },
];

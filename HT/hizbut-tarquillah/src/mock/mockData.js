// Mock data pour Hizbut Tarquillah

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

export const INITIAL_KHASSIDAS = [
  { 
    id: 'kh1', 
    titre: 'Fa-sayakfîkahumul Lâha', 
    titre_arabe: 'فسيكفيهم الله',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Protection suprême, suffisance divine et louanges...', 
    niveau: 'Intermédiaire', 
    pages_count: 3, 
    audios_count: 0, 
    vues_count: 0, 
    date_ajout: '19/07/2026', 
    is_bess_bi: true,
    telecharge: false,
    versets_count: 72, 
    duree_estimee: '15 min' 
  },
  { 
    id: 'kh2', 
    titre: 'AR-RAHMAÂNU AR-RAHÎMU', 
    titre_arabe: 'الرحمان الرحيم',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Méditation sur les Noms Divins de Miséricorde...', 
    niveau: 'Débutant', 
    pages_count: 1, 
    audios_count: 0, 
    vues_count: 1, 
    date_ajout: '19/08/2023', 
    is_bess_bi: false,
    telecharge: true,
    versets_count: 36, 
    duree_estimee: '10 min' 
  },
  { 
    id: 'kh3', 
    titre: 'Achkurul lâha', 
    titre_arabe: 'أشكر الله',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Reconnaissance et gratitude envers le Créateur...', 
    niveau: 'Intermédiaire', 
    pages_count: 2, 
    audios_count: 2, 
    vues_count: 0, 
    date_ajout: '19/08/2023', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 64, 
    duree_estimee: '14 min' 
  },
  { 
    id: 'kh4', 
    titre: 'Ad-Durru As-samîn - S Abdu Rahman Mb', 
    titre_arabe: 'الدر الثمين',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'La Perle Précieuse des enseignements sacrés...', 
    niveau: 'Avancé', 
    pages_count: 39, 
    audios_count: 0, 
    vues_count: 0, 
    date_ajout: '15/02/2026', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 220, 
    duree_estimee: '45 min' 
  },
  { 
    id: 'kh5', 
    titre: 'Ad-Durrus samîn', 
    titre_arabe: 'الدر الثمين',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Version condensée des louanges et sagesses...', 
    niveau: 'Intermédiaire', 
    pages_count: 18, 
    audios_count: 0, 
    vues_count: 0, 
    date_ajout: '28/08/2023', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 140, 
    duree_estimee: '25 min' 
  },
  { 
    id: 'kh6', 
    titre: 'Afalâ Tachkurûn', 
    titre_arabe: 'أفلا تشكرون',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Exhortation à l’action de grâce et à la ferveur...', 
    niveau: 'Débutant', 
    pages_count: 1, 
    audios_count: 0, 
    vues_count: 0, 
    date_ajout: '19/08/2023', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 48, 
    duree_estimee: '12 min' 
  },
  { 
    id: 'kh7', 
    titre: 'Mawâhibu Nâfi\'i', 
    titre_arabe: 'مواهب النافع',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Les Dons du Profit : prières sacrées sur le Prophète (PSL)...', 
    niveau: 'Avancé', 
    pages_count: 24, 
    audios_count: 3, 
    vues_count: 12, 
    date_ajout: '12/08/2026', 
    is_bess_bi: false,
    telecharge: true,
    versets_count: 144, 
    duree_estimee: '28 min' 
  },
  { 
    id: 'kh8', 
    titre: 'Jalîbatul Marâtib', 
    titre_arabe: 'جالبة المراتب',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'L’Attirante des Degrés spirituels et bénédictions...', 
    niveau: 'Intermédiaire', 
    pages_count: 16, 
    audios_count: 2, 
    vues_count: 8, 
    date_ajout: '05/08/2026', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 98, 
    duree_estimee: '20 min' 
  },
  { 
    id: 'kh9', 
    titre: 'Matlabul Fawzayni', 
    titre_arabe: 'مطلب الفوزين',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'La Quête du Bonheur dans les deux Mondes...', 
    niveau: 'Avancé', 
    pages_count: 32, 
    audios_count: 4, 
    vues_count: 15, 
    date_ajout: '01/08/2026', 
    is_bess_bi: false,
    telecharge: true,
    versets_count: 180, 
    duree_estimee: '35 min' 
  },
  { 
    id: 'kh10', 
    titre: 'Assîru', 
    titre_arabe: 'الأسير',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul', 
    texte: 'Le Secret et la protection inébranlable...', 
    niveau: 'Débutant', 
    pages_count: 8, 
    audios_count: 1, 
    vues_count: 5, 
    date_ajout: '20/07/2026', 
    is_bess_bi: false,
    telecharge: false,
    versets_count: 54, 
    duree_estimee: '12 min' 
  }
];

export const INITIAL_SONS_AUDIO = [
  {
    id: 'son1',
    titre: 'Achkurul lâha — Kourel 1 Officiel',
    titre_arabe: 'أشكر الله',
    khassida_id: 'kh3',
    recitateur: 'Kourel Miftahoul Mouna',
    duree: '14:20',
    qualite: 'HQ 320 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    date_enregistrement: '19/08/2023',
    pages_count: 2,
    audios_count: 2,
    vues_count: 12,
    taille: '16.4 Mo'
  },
  {
    id: 'son2',
    titre: 'Fa-sayakfîkahumul Lâha — Répétition Touba',
    titre_arabe: 'فسيكفيهم الله',
    khassida_id: 'kh1',
    recitateur: 'Serigne Modou Kara',
    duree: '15:10',
    qualite: 'HQ 256 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    date_enregistrement: '19/07/2026',
    pages_count: 3,
    audios_count: 1,
    vues_count: 6,
    taille: '12.8 Mo'
  },
  {
    id: 'son3',
    titre: 'Mawâhibu Nâfi\'i — Version Concert Magal',
    titre_arabe: 'مواهب النافع',
    khassida_id: 'kh7',
    recitateur: 'Kourel Touba Central',
    duree: '24:15',
    qualite: 'HQ 320 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    date_enregistrement: '12/08/2026',
    pages_count: 24,
    audios_count: 3,
    vues_count: 24,
    taille: '18.4 Mo'
  },
  {
    id: 'son4',
    titre: 'Jalîbatul Marâtib — Rythme Harmonisé',
    titre_arabe: 'جالبة المراتب',
    khassida_id: 'kh8',
    recitateur: 'Cheikh Ahmadou Ndiaye',
    duree: '17:40',
    qualite: 'HQ 256 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    date_enregistrement: '05/08/2026',
    pages_count: 16,
    audios_count: 2,
    vues_count: 18,
    taille: '13.2 Mo'
  },
  {
    id: 'son5',
    titre: 'Matlabul Fawzayni — Récitation Intégrale',
    titre_arabe: 'مطلب الفوزين',
    khassida_id: 'kh9',
    recitateur: 'Kourel Nurou Darayni',
    duree: '29:50',
    qualite: 'HQ 320 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    date_enregistrement: '01/08/2026',
    pages_count: 32,
    audios_count: 4,
    vues_count: 31,
    taille: '22.1 Mo'
  }
];

export const INITIAL_SEANCES = [
  {
    id: 's1',
    kourel_id: 'k1',
    date: '2026-08-12',
    heure_debut: '20:00',
    heure_fin: '22:00',
    khassida_id: 'kh1',
    audio_reference_url: 'https://example.com/audio/mawahibou_ref.mp3',
    recording_url: 'https://example.com/audio/seance_12aug.mp3',
    superviseur: 'Serigne Modou Kara',
    statut: 'Terminée',
    notes: 'Excellente maîtrise du rythme sur les couplets 4 à 12.',
    presences: [
      { membre_id: 'm1', statut: 'Présent', heure_arrivee: '20:00', justifie: false },
      { membre_id: 'm2', statut: 'Présent', heure_arrivee: '20:05', justifie: false },
      { membre_id: 'm3', statut: 'En retard', heure_arrivee: '20:25', justifie: true },
      { membre_id: 'm12', statut: 'Absent', heure_arrivee: '', justifie: false }
    ]
  },
  {
    id: 's2',
    kourel_id: 'k1',
    date: '2026-08-19',
    heure_debut: '20:00',
    heure_fin: '22:00',
    khassida_id: 'kh2',
    audio_reference_url: 'https://example.com/audio/jalibatul_ref.mp3',
    recording_url: '',
    superviseur: 'Cheikh Ahmadou Ndiaye',
    statut: 'Planifiée',
    notes: 'Réviser la première moitié avant la séance.',
    presences: [
      { membre_id: 'm1', statut: 'Présent', heure_arrivee: '20:00', justifie: false },
      { membre_id: 'm2', statut: 'Présent', heure_arrivee: '20:00', justifie: false },
      { membre_id: 'm3', statut: 'Présent', heure_arrivee: '20:00', justifie: false },
      { membre_id: 'm12', statut: 'Absent', heure_arrivee: '', justifie: false }
    ]
  },
  {
    id: 's3',
    kourel_id: 'k2',
    date: '2026-08-14',
    heure_debut: '18:30',
    heure_fin: '20:30',
    khassida_id: 'kh3',
    audio_reference_url: 'https://example.com/audio/assirou_ref.mp3',
    recording_url: 'https://example.com/audio/seance_k2_14aug.mp3',
    superviseur: 'Serigne Fallou Seck',
    statut: 'Terminée',
    notes: 'Bonne présence générale.',
    presences: [
      { membre_id: 'm4', statut: 'Présent', heure_arrivee: '18:30', justifie: false },
      { membre_id: 'm5', statut: 'Présent', heure_arrivee: '18:35', justifie: false },
      { membre_id: 'm6', statut: 'En retard', heure_arrivee: '19:00', justifie: false }
    ]
  }
];

export const INITIAL_KAMIL_CYCLE = {
  id: 'cycle-42',
  numero_cycle: 42,
  date_debut: '2026-08-10',
  date_fin_prevue: '2026-08-24',
  statut: 'En cours',
  duree_semaines: 2,
  assignations: [
    { juz: 1, membre_id: 'm1', nom_juz: 'Al-Fatiha à Al-Baqarah 141', statut: 'Terminé', date_validee: '2026-08-12' },
    { juz: 2, membre_id: 'm2', nom_juz: 'Al-Baqarah 142 à 252', statut: 'Terminé', date_validee: '2026-08-13' },
    { juz: 3, membre_id: 'm3', nom_juz: 'Al-Baqarah 253 à Al-Imran 92', statut: 'Terminé', date_validee: '2026-08-14' },
    { juz: 4, membre_id: 'm4', nom_juz: 'Al-Imran 93 à An-Nisa 23', statut: 'Terminé', date_validee: '2026-08-15' },
    { juz: 5, membre_id: 'm5', nom_juz: 'An-Nisa 24 à 147', statut: 'Terminé', date_validee: '2026-08-15' },
    { juz: 6, membre_id: 'm6', nom_juz: 'An-Nisa 148 à Al-Ma\'idah 81', statut: 'Terminé', date_validee: '2026-08-16' },
    { juz: 7, membre_id: 'm7', nom_juz: 'Al-Ma\'idah 82 à Al-An\'am 110', statut: 'En cours', date_validee: '' },
    { juz: 8, membre_id: 'm8', nom_juz: 'Al-An\'am 111 à Al-A\'raf 87', statut: 'En cours', date_validee: '' },
    { juz: 9, membre_id: 'm9', nom_juz: 'Al-A\'raf 88 à Al-Anfal 40', statut: 'En cours', date_validee: '' },
    { juz: 10, membre_id: 'm10', nom_juz: 'Al-Anfal 41 à At-Tawbah 92', statut: 'En cours', date_validee: '' },
    { juz: 11, membre_id: 'm11', nom_juz: 'At-Tawbah 93 à Hud 5', statut: 'En cours', date_validee: '' },
    { juz: 12, membre_id: 'm1', nom_juz: 'Hud 6 à Yusuf 52', statut: 'Terminé', date_validee: '2026-08-16' },
    { juz: 13, membre_id: 'm2', nom_juz: 'Yusuf 53 à Ibrahim 52', statut: 'En cours', date_validee: '' },
    { juz: 14, membre_id: 'm3', nom_juz: 'Al-Hijr 1 à An-Nahl 128', statut: 'En cours', date_validee: '' },
    { juz: 15, membre_id: 'm4', nom_juz: 'Al-Isra 1 à Al-Kahf 74', statut: 'Terminé', date_validee: '2026-08-16' },
    { juz: 16, membre_id: 'm5', nom_juz: 'Al-Kahf 75 à Ta-Ha 135', statut: 'À faire', date_validee: '' },
    { juz: 17, membre_id: 'm6', nom_juz: 'Al-Anbiya 1 à Al-Hajj 78', statut: 'À faire', date_validee: '' },
    { juz: 18, membre_id: 'm7', nom_juz: 'Al-Mu\'minun 1 à Al-Furqan 20', statut: 'À faire', date_validee: '' },
    { juz: 19, membre_id: 'm8', nom_juz: 'Al-Furqan 21 à An-Naml 55', statut: 'À faire', date_validee: '' },
    { juz: 20, membre_id: 'm9', nom_juz: 'An-Naml 56 à Al-Ankabut 45', statut: 'À faire', date_validee: '' },
    { juz: 21, membre_id: 'm10', nom_juz: 'Al-Ankabut 46 à Al-Ahzab 30', statut: 'À faire', date_validee: '' },
    { juz: 22, membre_id: 'm11', nom_juz: 'Al-Ahzab 31 à Ya-Sin 27', statut: 'À faire', date_validee: '' },
    { juz: 23, membre_id: 'm1', nom_juz: 'Ya-Sin 28 à Az-Zumar 31', statut: 'À faire', date_validee: '' },
    { juz: 24, membre_id: 'm2', nom_juz: 'Az-Zumar 32 à Fussilat 46', statut: 'À faire', date_validee: '' },
    { juz: 25, membre_id: 'm3', nom_juz: 'Fussilat 47 à Al-Jathiyah 37', statut: 'À faire', date_validee: '' },
    { juz: 26, membre_id: 'm4', nom_juz: 'Al-Ahqaf 1 à Az-Zariyat 30', statut: 'À faire', date_validee: '' },
    { juz: 27, membre_id: 'm5', nom_juz: 'Az-Zariyat 31 à Al-Hadid 29', statut: 'À faire', date_validee: '' },
    { juz: 28, membre_id: 'm6', nom_juz: 'Al-Mujadila 1 à At-Tahrim 12', statut: 'À faire', date_validee: '' },
    { juz: 29, membre_id: 'm7', nom_juz: 'Al-Mulk 1 à Al-Mursalat 50', statut: 'À faire', date_validee: '' },
    { juz: 30, membre_id: 'm8', nom_juz: 'An-Naba 1 à An-Nas 6', statut: 'À faire', date_validee: '' },
  ]
};

export const PAST_KAMIL_CYCLES = [
  { cycle: 'Cycle #36', completion: 100, jours: 11, echeance_respectee: true },
  { cycle: 'Cycle #37', completion: 100, jours: 14, echeance_respectee: true },
  { cycle: 'Cycle #38', completion: 93, jours: 14, echeance_respectee: false },
  { cycle: 'Cycle #39', completion: 100, jours: 10, echeance_respectee: true },
  { cycle: 'Cycle #40', completion: 100, jours: 12, echeance_respectee: true },
  { cycle: 'Cycle #41', completion: 100, jours: 13, echeance_respectee: true },
];

export const INITIAL_INFORMATIONS = [
  {
    id: 'inf1',
    titre: 'Grand Magal de Touba 2026 : Organisation des convois de Hizbut-Tarqiyyah',
    contenu: 'Chers membres, les préparatifs du Grand Magal s’intensifient. La réunion d’organisation générale aura lieu ce dimanche à 16h00 au siège de l’association. La présence de tous les superviseurs de Kourel est obligatoire.',
    categorie: 'Événement',
    date_publication: '2026-08-15',
    auteur: 'Super Admin',
    epingle: true,
    image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'inf2',
    titre: 'Nouveau programme des répétitions de Khassida pour le Kourel 1',
    contenu: 'En raison des travaux d’aménagement de la salle principale, les séances du Kourel 1 se tiendront désormais les mardis et vendredis à 20h30 précises. Merci de respecter l’horaire.',
    categorie: 'Annonce',
    date_publication: '2026-08-11',
    auteur: 'Serigne Modou Kara',
    epingle: false,
    image: ''
  },
  {
    id: 'inf3',
    titre: 'Clôture et succès du 41ème Cycle de Kamil collectif',
    contenu: 'Alhamdulillah ! Le 41ème cycle de lecture intégrale du Saint Coran s’est achevé avec succès en 13 jours grâce à l’engagement sans faille de nos 30 lecteurs. Qu’Allah agrée nos dévotions.',
    categorie: 'Communiqué',
    date_publication: '2026-08-08',
    auteur: 'Super Admin',
    epingle: false,
    image: ''
  }
];

export const ASSIDUITE_TREND_DATA = [
  { seance: 'Séance 1', taux: 78 },
  { seance: 'Séance 2', taux: 82 },
  { seance: 'Séance 3', taux: 80 },
  { seance: 'Séance 4', taux: 85 },
  { seance: 'Séance 5', taux: 88 },
  { seance: 'Séance 6', taux: 86 },
  { seance: 'Séance 7', taux: 91 },
  { seance: 'Séance 8', taux: 89 },
];

export const KOURELS_COMPARISON_DATA = [
  { name: 'Kourel 1', taux: 92, membreCount: 4 },
  { name: 'Kourel 2', taux: 88, membreCount: 3 },
  { name: 'Kourel 3', taux: 82, membreCount: 3 },
  { name: 'Kourel 4', taux: 95, membreCount: 2 },
];

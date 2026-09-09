// Données initiales propres pour Sama daara (Hizbut Tarquillah)

export const INITIAL_ZONES = [
  { id: 'z1', nom: 'Zone Touba Central', code: 'Z-TOUBA-01', description: 'Touba Mosquée, Darou Minam, Guédé Bousso, Dianatoul Mahwa', responsable: '', couleur: 'emerald' },
  { id: 'z2', nom: 'Zone Dakar & Littoral', code: 'Z-DKR-02', description: 'Mermoz, Yoff, Sacré-Cœur, Rufisque, Liberté 6', responsable: '', couleur: 'indigo' },
  { id: 'z3', nom: 'Zone Thiès & Baol', code: 'Z-THIES-03', description: 'Thiès Dixième, Diourbel, Khombole', responsable: '', couleur: 'amber' },
  { id: 'z4', nom: 'Zone Nord & Fleuve', code: 'Z-NORD-04', description: 'Saint-Louis Balacos, Louga, Matam', responsable: '', couleur: 'sky' },
  { id: 'z5', nom: 'Zone Saloum & Sud', code: 'Z-SALOUM-05', description: 'Kaolack Medina Baye, Fatick, Ziguinchor', responsable: '', couleur: 'rose' },
];

export const INITIAL_KOURELS = [
  { id: 'k1', nom: 'Kourel 1 — Miftahoul Mouna', description: 'Groupe principal des chanteurs de khassidas', date_creation: '', superviseurs: [] },
  { id: 'k2', nom: 'Kourel 2 — Fathou Rahmane', description: 'Section récitation et mémorisation', date_creation: '', superviseurs: [] },
  { id: 'k3', nom: 'Kourel 3 — Khidmatoul Khadim', description: 'Section jeunes et apprentis', date_creation: '', superviseurs: [] },
  { id: 'k4', nom: 'Kourel 4 — Nurou Darayni', description: 'Section dames et accompagnatrices', date_creation: '', superviseurs: [] },
];

export const INITIAL_SECTEURS = [
  { id: 'sec1', nom: 'Commission Organisation & Logistique', code: 'ORG-LOG', description: 'Gestion des convois, installation des cérémonies et organisation générale.' },
  { id: 'sec2', nom: 'Récitation & Kourel', code: 'REC-KOUR', description: 'Chant et déclamation des Khassidas et lecture du Saint Coran.' },
  { id: 'sec3', nom: 'Commission Restauration & Berndé', code: 'RESTO', description: 'Préparation et distribution des repas pour les évènements.' },
  { id: 'sec4', nom: 'Accueil & Protocole', code: 'PROT-ACC', description: 'Accueil des dignitaires, gestion des invités et discipline.' },
  { id: 'sec5', nom: 'Service Technique, Son & Médias', code: 'TECH-MEDIA', description: 'Gestion de la sonorisation, des retransmissions et enregistrements.' },
  { id: 'sec6', nom: 'Secrétariat & Trésorerie', code: 'ADMIN-FIN', description: 'Gestion administrative, collecte des cotisations et registres.' },
];

// Liste initiale de membres vide - Prête pour l'accueil de vrais membres
export const INITIAL_MEMBRES = [];

// Liste de Khassidas vide
export const INITIAL_KHASSIDAS = [];

// Liste Audio vide
export const INITIAL_SONS_AUDIO = [];

// Liste Séances vide
export const INITIAL_SEANCES = [];

// Cycle Kamil avec 30 Jukis disponibles / libres
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

export const KOURELS_COMPARISON_DATA = [];


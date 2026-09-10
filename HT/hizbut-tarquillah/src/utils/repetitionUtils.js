// Utilitaires de gestion des plannings et calcul de la prochaine répétition par Kourel

export const JOURS_SEMAINE = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

export const JOUR_TO_DAY_INDEX = {
  'Dimanche': 0,
  'Lundi': 1,
  'Mardi': 2,
  'Mercredi': 3,
  'Jeudi': 4,
  'Vendredi': 5,
  'Samedi': 6
};

export const DAY_INDEX_TO_JOUR = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi'
];

// Plannings par défaut réalistes pour les Kourels
export const DEFAULT_KOUREL_SCHEDULES = {
  k1: {
    jours: ['Mercredi', 'Samedi'],
    heure_debut: '20:00',
    heure_fin: '22:00',
    lieu: 'Siège Dahira Touba',
    slots: [
      { jour: 'Mercredi', heure_debut: '20:00', heure_fin: '22:00', lieu: 'Siège Dahira Touba' },
      { jour: 'Samedi', heure_debut: '20:30', heure_fin: '23:00', lieu: 'Grande Salle de Répétition' }
    ],
    notes: 'Répétition générale et vocalisation des Khassidas'
  },
  k2: {
    jours: ['Mardi', 'Vendredi'],
    heure_debut: '20:30',
    heure_fin: '22:30',
    lieu: 'Dianatoul Mahwa',
    slots: [
      { jour: 'Mardi', heure_debut: '20:30', heure_fin: '22:30', lieu: 'Dianatoul Mahwa' },
      { jour: 'Vendredi', heure_debut: '21:00', heure_fin: '23:00', lieu: 'Siège Dahira Touba' }
    ],
    notes: 'Mémorisation et récitation'
  },
  k3: {
    jours: ['Lundi', 'Jeudi'],
    heure_debut: '18:30',
    heure_fin: '20:30',
    lieu: 'Salle des Jeunes Touba',
    slots: [
      { jour: 'Lundi', heure_debut: '18:30', heure_fin: '20:30', lieu: 'Salle des Jeunes Touba' },
      { jour: 'Jeudi', heure_debut: '18:30', heure_fin: '20:30', lieu: 'Salle des Jeunes Touba' }
    ],
    notes: 'Apprentissage des rythmes et nouveaux khassidas'
  },
  k4: {
    jours: ['Dimanche'],
    heure_debut: '16:00',
    heure_fin: '18:30',
    lieu: 'Espace Femmes Dahira',
    slots: [
      { jour: 'Dimanche', heure_debut: '16:00', heure_fin: '18:30', lieu: 'Espace Femmes Dahira' }
    ],
    notes: 'Séance hebdomadaire'
  }
};

/**
 * Calcule la date exacte de la prochaine répétition pour un Kourel donné
 * @param {Object} kourel - Le kourel sélectionné
 * @param {Object} schedules - Dictionnaire des horaires par kourelId
 * @param {Array} seances - Liste des séances ponctuelles enregistrées
 * @returns {Object} Informations détaillées sur la prochaine séance
 */
export const getProchaineRepetition = (kourel, schedules = {}, seances = []) => {
  const now = new Date();
  const kourelId = kourel?.id || 'k1';
  const schedule = schedules[kourelId] || DEFAULT_KOUREL_SCHEDULES[kourelId] || {
    jours: ['Mercredi', 'Samedi'],
    heure_debut: '20:00',
    heure_fin: '22:00',
    lieu: 'Siège Dahira',
    slots: [
      { jour: 'Mercredi', heure_debut: '20:00', heure_fin: '22:00', lieu: 'Siège Dahira' },
      { jour: 'Samedi', heure_debut: '20:30', heure_fin: '23:00', lieu: 'Siège Dahira' }
    ]
  };

  const candidates = [];

  // 1. Vérifier si une séance ponctuelle future existe dans `seances`
  if (Array.isArray(seances)) {
    const upcomingExplicit = seances.filter(s => 
      s.kourel_id === kourelId && 
      (s.statut === 'Planifiée' || s.statut === 'En cours') &&
      s.date
    );

    upcomingExplicit.forEach(s => {
      const [hDebut = '20', mDebut = '00'] = (s.heure_debut || '20:00').split(':');
      const [year, month, day] = s.date.split('-').map(Number);
      if (year && month && day) {
        const sDate = new Date(year, month - 1, day, Number(hDebut), Number(mDebut));
        const [hFin = '22', mFin = '00'] = (s.heure_fin || '22:00').split(':');
        const sEndDate = new Date(year, month - 1, day, Number(hFin), Number(mFin));

        // Si la séance n'est pas encore terminée
        if (sEndDate >= now) {
          candidates.push({
            date: sDate,
            endDate: sEndDate,
            heure_debut: s.heure_debut || '20:00',
            heure_fin: s.heure_fin || '22:00',
            lieu: s.lieu || schedule.lieu || 'Siège Dahira',
            titre: s.titre || kourel?.nom || 'Prochaine séance',
            isExplicitSeance: true,
            seanceId: s.id
          });
        }
      }
    });
  }

  // 2. Vérifier les créneaux récurrents du programme (slots)
  const currentDayIndex = now.getDay(); // 0 = Dimanche, 1 = Lundi, ...
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  const slots = schedule.slots && schedule.slots.length > 0
    ? schedule.slots
    : (schedule.jours || []).map(j => ({
        jour: j,
        heure_debut: schedule.heure_debut || '20:00',
        heure_fin: schedule.heure_fin || '22:00',
        lieu: schedule.lieu || 'Siège Dahira'
      }));

  slots.forEach(slot => {
    const targetDayIndex = JOUR_TO_DAY_INDEX[slot.jour];
    if (targetDayIndex === undefined) return;

    const [hDebut = '20', mDebut = '00'] = (slot.heure_debut || '20:00').split(':');
    const [hFin = '22', mFin = '00'] = (slot.heure_fin || '22:00').split(':');
    const startMinutes = Number(hDebut) * 60 + Number(mDebut);
    const endMinutes = Number(hFin) * 60 + Number(mFin);

    let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;

    // Si c'est aujourd'hui
    if (daysToAdd === 0) {
      if (currentTotalMinutes > endMinutes) {
        // La séance d'aujourd'hui est déjà terminée, la prochaine sera dans 7 jours
        daysToAdd = 7;
      }
    }

    const candidateDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysToAdd,
      Number(hDebut),
      Number(mDebut)
    );

    const candidateEndDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysToAdd,
      Number(hFin),
      Number(mFin)
    );

    candidates.push({
      date: candidateDate,
      endDate: candidateEndDate,
      jour: slot.jour,
      heure_debut: slot.heure_debut || '20:00',
      heure_fin: slot.heure_fin || '22:00',
      lieu: slot.lieu || schedule.lieu || 'Siège Dahira',
      titre: kourel?.nom || 'Prochaine séance',
      isExplicitSeance: false
    });
  });

  // Si aucun candidat trouvé, fallback
  if (candidates.length === 0) {
    return {
      titre: kourel?.nom || 'Prochaine séance',
      heure_debut: '20:00',
      heure_fin: '22:00',
      lieu: 'Siège Dahira',
      dayLabel: 'Prochainement',
      fullDateLabel: 'Aucune répétition planifiée',
      remainingDays: null,
      countdownValue: '--',
      countdownUnit: 'En attente',
      isToday: false,
      isEnCours: false,
      strokeOffset: 264
    };
  }

  // Trier par date la plus proche
  candidates.sort((a, b) => a.date - b.date);
  const next = candidates[0];

  // Calcul du décompte
  const diffMs = next.date - now;
  const isEnCours = now >= next.date && now <= next.endDate;
  const isToday = next.date.toDateString() === now.toDateString();

  // Différence en jours entiers (du jour J au jour cible)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetMidnight = new Date(next.date.getFullYear(), next.date.getMonth(), next.date.getDate());
  const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

  let dayLabel = next.jour || next.date.toLocaleDateString('fr-FR', { weekday: 'long' });
  // Capitaliser
  dayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

  let countdownValue = `${diffDays} Jr${diffDays > 1 ? 's' : ''}`;
  let countdownUnit = 'restants';

  if (isEnCours) {
    countdownValue = 'En cours';
    countdownUnit = 'À la salle';
  } else if (isToday) {
    countdownValue = 'Aujourd\'hui';
    countdownUnit = `à ${next.heure_debut}`;
  } else if (diffDays === 1) {
    countdownValue = '1 Jr';
    countdownUnit = 'Demain';
  }

  // Calcul visuel du cercle svg (264 = circonférence)
  // Plus on est proche, plus le cercle se remplit
  let strokeOffset = 75;
  if (isEnCours || isToday) strokeOffset = 0;
  else if (diffDays <= 7) {
    strokeOffset = Math.round(264 * (diffDays / 7));
  }

  const fullDateLabel = next.date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return {
    ...next,
    diffDays,
    isToday,
    isEnCours,
    dayLabel,
    fullDateLabel,
    countdownValue,
    countdownUnit,
    strokeOffset
  };
};

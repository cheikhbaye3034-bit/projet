import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  MapPin, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JOURS_SEMAINE, DEFAULT_KOUREL_SCHEDULES, getProchaineRepetition } from '../../../utils/repetitionUtils';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const HorairesRepetitionModal = ({ isOpen, onClose, defaultKourelId }) => {
  const { kourels, kourelSchedules, updateKourelSchedule, seances, showToast } = useApp();

  const [selectedKourelId, setSelectedKourelId] = useState(defaultKourelId || kourels[0]?.id || 'k1');

  // État local du formulaire pour le kourel sélectionné
  const [joursSelectionnes, setJoursSelectionnes] = useState(['Mercredi', 'Samedi']);
  const [heureDebutGlobale, setHeureDebutGlobale] = useState('20:00');
  const [heureFinGlobale, setHeureFinGlobale] = useState('22:00');
  const [lieuGlobal, setLieuGlobal] = useState('Siège Dahira Touba');
  const [slotsParJour, setSlotsParJour] = useState({});
  const [notes, setNotes] = useState('');

  // Charger le programme du kourel lors du changement de sélection ou à l'ouverture
  useEffect(() => {
    if (!selectedKourelId) return;
    const currentSchedule = (kourelSchedules && kourelSchedules[selectedKourelId]) || 
                            DEFAULT_KOUREL_SCHEDULES[selectedKourelId] || 
                            DEFAULT_KOUREL_SCHEDULES['k1'];

    const initialJours = currentSchedule?.jours || ['Mercredi', 'Samedi'];
    setJoursSelectionnes(initialJours);
    setHeureDebutGlobale(currentSchedule?.heure_debut || '20:00');
    setHeureFinGlobale(currentSchedule?.heure_fin || '22:00');
    setLieuGlobal(currentSchedule?.lieu || 'Siège Dahira Touba');
    setNotes(currentSchedule?.notes || '');

    // Construire ou charger les slots spécifiques
    const mapSlots = {};
    if (Array.isArray(currentSchedule?.slots)) {
      currentSchedule.slots.forEach(s => {
        if (s.jour) {
          mapSlots[s.jour] = {
            heure_debut: s.heure_debut || currentSchedule?.heure_debut || '20:00',
            heure_fin: s.heure_fin || currentSchedule?.heure_fin || '22:00',
            lieu: s.lieu || currentSchedule?.lieu || 'Siège Dahira Touba'
          };
        }
      });
    }

    // S'assurer que chaque jour sélectionné a son slot
    initialJours.forEach(j => {
      if (!mapSlots[j]) {
        mapSlots[j] = {
          heure_debut: currentSchedule?.heure_debut || '20:00',
          heure_fin: currentSchedule?.heure_fin || '22:00',
          lieu: currentSchedule?.lieu || 'Siège Dahira Touba'
        };
      }
    });

    setSlotsParJour(mapSlots);
  }, [selectedKourelId, kourelSchedules, isOpen]);

  // Si modal fermée, ne rien afficher
  if (!isOpen) return null;

  const currentKourel = kourels.find(k => k.id === selectedKourelId) || kourels[0];

  // Gestion du toggle d'un jour
  const handleToggleJour = (jour) => {
    let nextJours;
    if (joursSelectionnes.includes(jour)) {
      if (joursSelectionnes.length === 1) {
        showToast && showToast('Veuillez conserver au moins un jour de répétition.', 'error');
        return;
      }
      nextJours = joursSelectionnes.filter(j => j !== jour);
    } else {
      nextJours = [...joursSelectionnes, jour];
      // Si pas de slot existant pour ce jour, l'initialiser
      if (!slotsParJour[jour]) {
        setSlotsParJour(prev => ({
          ...prev,
          [jour]: {
            heure_debut: heureDebutGlobale,
            heure_fin: heureFinGlobale,
            lieu: lieuGlobal
          }
        }));
      }
    }
    setJoursSelectionnes(nextJours);
  };

  // Mettre à jour les horaires d'un jour spécifique
  const handleSlotChange = (jour, field, value) => {
    setSlotsParJour(prev => ({
      ...prev,
      [jour]: {
        ...(prev[jour] || { heure_debut: heureDebutGlobale, heure_fin: heureFinGlobale, lieu: lieuGlobal }),
        [field]: value
      }
    }));
  };

  // Appliquer les horaires globaux à tous les jours
  const handleAppliquerATous = () => {
    const updated = {};
    joursSelectionnes.forEach(j => {
      updated[j] = {
        heure_debut: heureDebutGlobale,
        heure_fin: heureFinGlobale,
        lieu: lieuGlobal
      };
    });
    setSlotsParJour(updated);
    showToast && showToast('Horaires appliqués à tous les jours sélectionnés !');
  };

  // Réinitialiser aux valeurs d'origine
  const handleResetDefaults = () => {
    const defaultSch = DEFAULT_KOUREL_SCHEDULES[selectedKourelId] || DEFAULT_KOUREL_SCHEDULES['k1'];
    setJoursSelectionnes(defaultSch.jours);
    setHeureDebutGlobale(defaultSch.heure_debut);
    setHeureFinGlobale(defaultSch.heure_fin);
    setLieuGlobal(defaultSch.lieu);
    const map = {};
    defaultSch.slots.forEach(s => { map[s.jour] = { ...s }; });
    setSlotsParJour(map);
    setNotes(defaultSch.notes || '');
    showToast && showToast('Horaires par défaut restaurés.');
  };

  // Sauvegarder
  const handleSave = (e) => {
    e.preventDefault();
    if (joursSelectionnes.length === 0) {
      showToast && showToast('Veuillez sélectionner au moins un jour de répétition.', 'error');
      return;
    }

    const compiledSlots = joursSelectionnes.map(jour => ({
      jour,
      heure_debut: slotsParJour[jour]?.heure_debut || heureDebutGlobale,
      heure_fin: slotsParJour[jour]?.heure_fin || heureFinGlobale,
      lieu: slotsParJour[jour]?.lieu || lieuGlobal
    }));

    const scheduleData = {
      jours: joursSelectionnes,
      heure_debut: heureDebutGlobale,
      heure_fin: heureFinGlobale,
      lieu: lieuGlobal,
      slots: compiledSlots,
      notes,
      updated_at: new Date().toISOString()
    };

    updateKourelSchedule(selectedKourelId, scheduleData);
    onClose();
  };

  // Calcul dynamique de l'aperçu de la prochaine séance avec les données actuelles
  const simulatedSchedule = {
    [selectedKourelId]: {
      jours: joursSelectionnes,
      heure_debut: heureDebutGlobale,
      heure_fin: heureFinGlobale,
      lieu: lieuGlobal,
      slots: joursSelectionnes.map(j => slotsParJour[j] || {
        jour: j,
        heure_debut: heureDebutGlobale,
        heure_fin: heureFinGlobale,
        lieu: lieuGlobal
      })
    }
  };
  const prochaineSeancePreview = getProchaineRepetition(currentKourel, simulatedSchedule, seances);

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up max-h-[92vh] flex flex-col">
        
        {/* En-tête avec fond émeraude et motif islamique */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#104b32] to-[#0a261a] text-white flex items-center justify-between overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shadow-inner border border-amber-400/40">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Planning Récurrent
                </span>
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                Jours & Heures de Répétition
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Définissez le calendrier officiel des séances en fonction du Kourel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sélecteur de Kourel en onglets modernes */}
        <div className="px-5 pt-4 pb-2 bg-slate-50 border-b border-slate-200 shrink-0">
          <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider block mb-2">
            Choisir la Section Kourel à configurer :
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {kourels.map(k => {
              const isSelected = selectedKourelId === k.id;
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setSelectedKourelId(k.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={`text-[10px] font-extrabold ${isSelected ? 'text-amber-300' : 'text-emerald-700'}`}>
                    Section
                  </span>
                  <span className="font-bold text-xs truncate max-w-full mt-0.5">
                    {k.nom.split('—')[1] || k.nom}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Corps du formulaire avec scroll */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1 : Sélection des jours de répétition */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Jours de répétition hebdomadaire ({joursSelectionnes.length} jours)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Cliquez pour activer/désactiver</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {JOURS_SEMAINE.map(jour => {
                const isActive = joursSelectionnes.includes(jour);
                return (
                  <button
                    key={jour}
                    type="button"
                    onClick={() => handleToggleJour(jour)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-black">{jour.slice(0, 3)}</span>
                    <span className="text-[10px] opacity-80">{jour}</span>
                    {isActive ? (
                      <Check className="w-3 h-3 text-amber-300" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2 : Horaires et Lieux détaillés pour chaque jour actif */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Créneaux horaires & Lieu par jour</span>
              </label>

              {/* Action rapide : Appliquer à tous */}
              <button
                type="button"
                onClick={handleAppliquerATous}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                ⚡ Aligner tous les jours sur {heureDebutGlobale} - {heureFinGlobale}
              </button>
            </div>

            {/* Liste des jours actifs avec champs éditables */}
            <div className="space-y-2.5">
              {joursSelectionnes.map(jour => {
                const slot = slotsParJour[jour] || {
                  heure_debut: heureDebutGlobale,
                  heure_fin: heureFinGlobale,
                  lieu: lieuGlobal
                };

                return (
                  <div 
                    key={jour} 
                    className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 transition-all hover:border-emerald-300"
                  >
                    {/* Badge Jour */}
                    <div className="min-w-[100px] flex items-center gap-2 font-display font-black text-xs text-slate-900">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span>{jour}</span>
                    </div>

                    {/* Heures début et fin */}
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">Début :</span>
                        <input
                          type="time"
                          value={slot.heure_debut}
                          onChange={(e) => {
                            handleSlotChange(jour, 'heure_debut', e.target.value);
                            setHeureDebutGlobale(e.target.value);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">Fin :</span>
                        <input
                          type="time"
                          value={slot.heure_fin}
                          onChange={(e) => {
                            handleSlotChange(jour, 'heure_fin', e.target.value);
                            setHeureFinGlobale(e.target.value);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Lieu */}
                    <div className="flex items-center gap-1.5 flex-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Lieu de répétition..."
                        value={slot.lieu}
                        onChange={(e) => {
                          handleSlotChange(jour, 'lieu', e.target.value);
                          setLieuGlobal(e.target.value);
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes optionnelles */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">
              Consignes / Notes de répétition (ex: livrets de chant, tenue) :
            </label>
            <input
              type="text"
              placeholder="Ex: Tenue blanche recommandée, apporter les livrets des Khassidas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* APERÇU EN DIRECT DU CALCUL DE LA PROCHAINE SÉANCE */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#104b32] to-[#0a261a] text-white border border-emerald-700/50 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-amber-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Aperçu de la Prochaine Répétition Calculée</span>
              </span>
              <span className="font-semibold text-emerald-300">
                {currentKourel?.nom}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <div>
                <h4 className="font-display font-black text-base sm:text-lg text-white">
                  {prochaineSeancePreview.dayLabel} à {prochaineSeancePreview.heure_debut}
                </h4>
                <p className="text-xs text-emerald-200/90 font-medium flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{prochaineSeancePreview.lieu}</span>
                  <span>•</span>
                  <span>{prochaineSeancePreview.fullDateLabel}</span>
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/20 text-center shrink-0">
                <span className="block font-black text-sm text-amber-300">
                  {prochaineSeancePreview.countdownValue}
                </span>
                <span className="text-[10px] text-emerald-200 font-semibold">
                  {prochaineSeancePreview.countdownUnit}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Pied de page avec actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Réinitialiser par défaut</span>
          </button>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Enregistrer les Horaires</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Calendar, Users, Check, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroKamilBg from '../../../assets/images/kamil_hero_quran.jpg';

export const NouveauCycleModal = ({ isOpen, onClose }) => {
  const { lancerNouveauCycle, kamilCycle, showToast } = useApp();
  const [dureeSemaines, setDureeSemaines] = useState(2);
  const [modeAssignation, setModeAssignation] = useState('auto');
  const [dateDebut, setDateDebut] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    lancerNouveauCycle(dureeSemaines, modeAssignation);
    showToast && showToast(`✨ Cycle Kamil #${(kamilCycle?.numero_cycle || 0) + 1} lancé avec succès !`);
    onClose();
  };

  const nextCycleNumber = (kamilCycle?.numero_cycle || 0) + 1;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        
        {/* Modal Header with Dark Emerald Background Pattern */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroKamilBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md border border-emerald-600/40 flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Lancer le Cycle Kamil #{nextCycleNumber}
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Création et répartition des 30 parties du Saint Coran
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Date de lancement du Cycle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          </div>

          {/* Duration selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Échéance prévue du Cycle <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDureeSemaines(1)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  dureeSemaines === 1
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-display font-black text-xs text-slate-900 flex items-center justify-between">
                  <span>1 Semaine</span>
                  {dureeSemaines === 1 && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">7 jours (Intensif)</div>
              </button>

              <button
                type="button"
                onClick={() => setDureeSemaines(2)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  dureeSemaines === 2
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-display font-black text-xs text-slate-900 flex items-center justify-between">
                  <span>2 Semaines</span>
                  {dureeSemaines === 2 && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">14 jours (Standard)</div>
              </button>
            </div>
          </div>

          {/* Assignment mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Mode de répartition des 30 Jukis <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setModeAssignation('auto')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  modeAssignation === 'auto'
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-display font-black text-xs text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Répartition Automatique Équilibrée</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Affecte équitablement les 30 portions parmi les membres actifs du Daara.
                  </div>
                </div>
                {modeAssignation === 'auto' && <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setModeAssignation('manuel')}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  modeAssignation === 'manuel'
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-display font-black text-xs text-slate-900 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span>Attribution Manuelle</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Vous sélectionnerez vous-même les membres pour chaque Juki après la création.
                  </div>
                </div>
                {modeAssignation === 'manuel' && <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lancer le Cycle</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

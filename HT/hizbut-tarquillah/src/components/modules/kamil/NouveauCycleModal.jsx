import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Calendar, Users, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const NouveauCycleModal = ({ isOpen, onClose }) => {
  const { lancerNouveauCycle, kamilCycle } = useApp();
  const [dureeSemaines, setDureeSemaines] = useState(2);
  const [modeAssignation, setModeAssignation] = useState('auto');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    lancerNouveauCycle(dureeSemaines, modeAssignation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ht-ink/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-2xl z-10 animate-scale-up">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-ht-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-emerald text-white flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-ht-ink">
                Lancer le Cycle Kamil #{kamilCycle.numero_cycle + 1}
              </h3>
              <p className="text-xs text-ht-inkSoft">Création de la répartition des 30 parties du Coran</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ht-sage hover:bg-ht-mist transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Duration selection */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-2">
              Échéance prévue du Cycle
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDureeSemaines(1)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  dureeSemaines === 1
                    ? 'bg-ht-mist border-ht-emerald shadow-sm'
                    : 'bg-ht-page border-ht-line hover:border-ht-mint'
                }`}
              >
                <div className="font-display font-bold text-sm text-ht-ink">1 Semaine</div>
                <div className="text-[11px] text-ht-sage">Lecture intensive (7 jours)</div>
              </button>

              <button
                type="button"
                onClick={() => setDureeSemaines(2)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  dureeSemaines === 2
                    ? 'bg-ht-mist border-ht-emerald shadow-sm'
                    : 'bg-ht-page border-ht-line hover:border-ht-mint'
                }`}
              >
                <div className="font-display font-bold text-sm text-ht-ink">2 Semaines</div>
                <div className="text-[11px] text-ht-sage">Rythme standard (14 jours)</div>
              </button>
            </div>
          </div>

          {/* Assignment mode */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-2">
              Mode de répartition des 30 Juz'
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setModeAssignation('auto')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  modeAssignation === 'auto'
                    ? 'bg-ht-mist border-ht-emerald shadow-sm'
                    : 'bg-ht-page border-ht-line hover:border-ht-mint'
                }`}
              >
                <div>
                  <div className="font-display font-bold text-sm text-ht-ink flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-ht-emerald" />
                    <span>Génération Automatique Équilibrée</span>
                  </div>
                  <div className="text-xs text-ht-sage mt-0.5">
                    Pioche équitablement parmi les membres actifs de tous les kourels.
                  </div>
                </div>
                {modeAssignation === 'auto' && <Check className="w-5 h-5 text-ht-emerald" />}
              </button>

              <button
                type="button"
                onClick={() => setModeAssignation('manual')}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  modeAssignation === 'manual'
                    ? 'bg-ht-mist border-ht-emerald shadow-sm'
                    : 'bg-ht-page border-ht-line hover:border-ht-mint'
                }`}
              >
                <div>
                  <div className="font-display font-bold text-sm text-ht-ink flex items-center gap-2">
                    <Users className="w-4 h-4 text-ht-emerald" />
                    <span>Assignation Manuelle par le Superviseur</span>
                  </div>
                  <div className="text-xs text-ht-sage mt-0.5">
                    Vous choisirez individuellement le membre pour chaque Juz'.
                  </div>
                </div>
                {modeAssignation === 'manual' && <Check className="w-5 h-5 text-ht-emerald" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-ht-line">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 gradient-emerald text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Lancer le nouveau cycle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

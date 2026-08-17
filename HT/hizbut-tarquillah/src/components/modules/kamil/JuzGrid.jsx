import React from 'react';
import { UserCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const JuzGrid = ({ onOpenAttribution }) => {
  const { kamilCycle, membres, updateJuzStatut } = useApp();

  const terminesCount = kamilCycle.assignations.filter(a => a.statut === 'Terminé').length;
  const enCoursCount = kamilCycle.assignations.filter(a => a.statut === 'En cours').length;
  const aFaireCount = kamilCycle.assignations.filter(a => a.statut === 'À faire').length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft space-y-6">
      {/* Header & Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ht-line pb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display font-bold text-xl text-ht-ink">
            Les 30 Juki
          </h3>
          {onOpenAttribution && (
            <button
              onClick={onOpenAttribution}
              className="btn-anim px-3 py-1 bg-ht-mist text-ht-emerald border border-ht-mint rounded-xl text-xs font-bold hover:bg-ht-mint flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Gérer les attributions</span>
            </button>
          )}
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-2 text-ht-emerald">
            <span className="w-3 h-3 rounded-full bg-ht-emerald inline-block"></span>
            <span>Terminé ({terminesCount})</span>
          </span>
          <span className="flex items-center gap-2 text-ht-fern">
            <span className="w-3 h-3 rounded-full bg-ht-mint inline-block border border-ht-sage"></span>
            <span>En cours ({enCoursCount})</span>
          </span>
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full border-2 border-dashed border-slate-300 inline-block"></span>
            <span>À faire ({aFaireCount})</span>
          </span>
        </div>
      </div>

      {/* 5-Column Grid of 30 Juz Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-6 gap-x-4">
        {kamilCycle.assignations.map((item) => {
          const membre = membres.find((m) => m.id === item.membre_id);
          const isCompleted = item.statut === 'Terminé';
          const isInProgress = item.statut === 'En cours';

          let shortName = 'Attribué';
          if (membre) {
            shortName = `${membre.prenom.split(' ')[0]} ${membre.nom[0]}.`;
          }

          const handleNextStatus = () => {
            if (item.statut === 'À faire') updateJuzStatut(item.juz, 'En cours');
            else if (item.statut === 'En cours') updateJuzStatut(item.juz, 'Terminé');
            else updateJuzStatut(item.juz, 'À faire');
          };

          return (
            <div 
              key={item.juz} 
              onClick={handleNextStatus}
              className="flex flex-col items-center gap-1.5 cursor-pointer group transform hover:-translate-y-0.5 transition-all"
              title={`Juki ${item.juz} - (${item.statut}) - Attribué à ${membre ? membre.prenom + ' ' + membre.nom : 'Membre'} — Cliquer pour changer le statut`}
            >
              {/* Oval / Pill Button Number */}
              <div
                className={`w-full max-w-[90px] py-1.5 rounded-full font-display font-extrabold text-sm text-center shadow-xs transition-all ${
                  isCompleted
                    ? 'bg-ht-emerald text-white group-hover:bg-ht-emeraldDark'
                    : isInProgress
                    ? 'bg-ht-mint text-ht-emerald font-bold border border-ht-sage/40 group-hover:bg-ht-mintDeep'
                    : 'border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                {item.juz}
              </div>

              {/* Truncated Member Name */}
              <div className="text-xs font-semibold text-ht-inkSoft group-hover:text-ht-ink transition-colors truncate max-w-[100px] text-center">
                {shortName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

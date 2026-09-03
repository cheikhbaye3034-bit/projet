import React from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Info,
  Check
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const JuzGrid = () => {
  const { kamilCycle, membres } = useApp();

  const assignations = kamilCycle?.assignations || [];

  const terminesCount = assignations.filter(a => a.statut === 'Terminé').length;
  const enCoursCount = assignations.filter(a => a.statut === 'En cours').length;
  const aFaireCount = assignations.filter(a => a.statut === 'À faire' || !a.membre_id).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 select-none">
      
      {/* ── Header & Read-Only Notice Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-black text-xl text-slate-900">
              Les 30 Jukis du Cycle #{kamilCycle?.numero_cycle || 42}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3 text-emerald-700" />
              <span>Consultation Seule</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
            <span>Chaque Juki réservé ou lu par un membre depuis son espace s'affiche automatiquement ici.</span>
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Terminé ({terminesCount})</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>En cours ({enCoursCount})</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-slate-400"></span>
            <span>Non pris ({aFaireCount})</span>
          </span>
        </div>
      </div>

      {/* ── 5-Column Grid of 30 Juz Display Cards (Read-Only) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
        {assignations.map((item) => {
          const membre = membres.find((m) => m.id === item.membre_id);
          const isCompleted = item.statut === 'Terminé';
          const isInProgress = item.statut === 'En cours';
          const isAssigned = !!item.membre_id && item.statut !== 'Libre';

          let memberDisplayName = 'Disponible';
          if (isAssigned && membre) {
            memberDisplayName = `${membre.prenom} ${membre.nom}`;
          }

          return (
            <div 
              key={item.juz} 
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col items-center justify-between text-center gap-2 cursor-default ${
                isCompleted
                  ? 'bg-gradient-to-b from-emerald-800 to-emerald-900 text-white border-emerald-700 shadow-sm'
                  : isInProgress
                  ? 'bg-emerald-50/90 text-emerald-950 border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-2 border-dashed border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
              title={`Juki ${item.juz} : ${isCompleted ? 'Terminé par ' + memberDisplayName : isInProgress ? 'En cours par ' + memberDisplayName : 'Disponible'}`}
            >
              {/* Top: Juki Number badge */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                  isCompleted
                    ? 'bg-emerald-700/80 text-emerald-200'
                    : isInProgress
                    ? 'bg-emerald-200 text-emerald-900 font-extrabold'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  Juki {item.juz}
                </span>

                {isCompleted && (
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                {isInProgress && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                )}
              </div>

              {/* Center: Member Name / Taken info */}
              <div className="min-w-0 w-full py-1">
                {isAssigned && membre ? (
                  <div className="space-y-0.5">
                    <p className={`font-display font-bold text-xs sm:text-sm truncate ${
                      isCompleted ? 'text-white' : 'text-slate-900'
                    }`}>
                      {memberDisplayName}
                    </p>
                    <p className={`text-[10px] font-medium truncate ${
                      isCompleted ? 'text-emerald-200' : 'text-emerald-700'
                    }`}>
                      {isCompleted ? '✓ Récitation validée' : '⏳ En cours de lecture'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5 py-0.5">
                    <p className="font-display font-semibold text-xs text-slate-400 italic">
                      Libre
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Non attribué
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Status Tag */}
              <div className="w-full pt-1 border-t border-black/5 dark:border-white/10">
                <span className={`text-[10px] font-extrabold block truncate ${
                  isCompleted
                    ? 'text-emerald-300'
                    : isInProgress
                    ? 'text-amber-800'
                    : 'text-slate-400'
                }`}>
                  {isCompleted ? 'Terminé' : isInProgress ? 'Pris' : 'Disponible'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Check, 
  Plus, 
  User, 
  Calendar, 
  Layers, 
  ChevronRight,
  BookmarkCheck,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import kamilHeroQuran from '../../../assets/images/kamil_hero_quran.jpg';

export const MembreKamilTab = () => {
  const { currentUser, kamilCycle, setKamilCycle, showToast } = useApp();
  
  const [selectedJukiForClaim, setSelectedJukiForClaim] = useState([]);
  const [isClaiming, setIsClaiming] = useState(false);

  const assignations = kamilCycle?.assignations || [];

  // Member's assigned Jukis
  const myAssignedJuki = assignations.filter(a => a.membre_id === currentUser?.id);
  
  // Available (unassigned or free) Jukis
  const availableJukiCount = assignations.filter(a => !a.membre_id || a.statut === 'À faire').length;

  // Days remaining
  const remainingDays = 4;

  // Toggle selection for claiming new Jukis (limit 1 to 3)
  const toggleSelectJuki = (jukiNumber, isAvailable) => {
    if (!isAvailable) {
      showToast && showToast(`Le Juki ${jukiNumber} est déjà en cours de récitation par un autre membre.`, 'info');
      return;
    }

    if (selectedJukiForClaim.includes(jukiNumber)) {
      setSelectedJukiForClaim(prev => prev.filter(j => j !== jukiNumber));
    } else {
      if (selectedJukiForClaim.length >= 3) {
        showToast && showToast('Vous pouvez sélectionner au maximum 3 Jukis par cycle.', 'info');
        return;
      }
      setSelectedJukiForClaim(prev => [...prev, jukiNumber]);
    }
  };

  // Confirm claiming selected Jukis
  const handleClaimJuki = () => {
    if (selectedJukiForClaim.length === 0) return;
    setIsClaiming(true);

    setTimeout(() => {
      const updatedAssignations = assignations.map(a => {
        if (selectedJukiForClaim.includes(a.juz)) {
          return {
            ...a,
            membre_id: currentUser?.id,
            statut: 'En cours'
          };
        }
        return a;
      });

      if (setKamilCycle) {
        setKamilCycle(prev => ({
          ...prev,
          assignations: updatedAssignations
        }));
      }

      showToast && showToast(`Félicitations ! Les Jukis ${selectedJukiForClaim.join(', ')} vous ont été assignés avec succès.`);
      setSelectedJukiForClaim([]);
      setIsClaiming(false);
    }, 400);
  };

  // Mark reading completed
  const handleMarkCompleted = (jukiNumber) => {
    const updatedAssignations = assignations.map(a => {
      if (a.juz === jukiNumber && a.membre_id === currentUser?.id) {
        return {
          ...a,
          statut: 'Terminé',
          date_validee: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    });

    if (setKamilCycle) {
      setKamilCycle(prev => ({
        ...prev,
        assignations: updatedAssignations
      }));
    }

    showToast && showToast(`Barak'Allah fik ! Votre lecture du Juki ${jukiNumber} a été validée avec succès.`);
  };

  // Overall progress
  const totalCompleted = assignations.filter(a => a.statut === 'Terminé' || a.statut === 'Validé').length;
  const progressPercent = Math.round((totalCompleted / 30) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16 select-none">
      
      {/* =========================================================================
          BARRE DE PROGRESSION SIMPLE ET JOURS RESTANTS
      ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-soft space-y-3 sm:space-y-4">
        
        {/* Top Header: Cycle & Days Remaining */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
                  Cycle #{kamilCycle?.numero_cycle || 42}
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900">
                  En cours
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {totalCompleted} sur 30 Jukis complétés ({progressPercent}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Days remaining badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{remainingDays} jours restants</span>
            </div>

            {/* Percentage */}
            <span className="text-base sm:text-lg font-display font-black text-emerald-800">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Simple & Clean Progress Bar */}
        <div className="w-full h-3 sm:h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

      </div>

      {/* =========================================================================
          SECTION : MES JUKIS ASSIGNÉS
      ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>Mes Jukis assignés ({myAssignedJuki.length})</span>
          </h3>
          {myAssignedJuki.length > 0 && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {myAssignedJuki.filter(j => j.statut === 'Terminé' || j.statut === 'Validé').length} / {myAssignedJuki.length} terminé(s)
            </span>
          )}
        </div>

        {myAssignedJuki.length === 0 ? (
          <div className="pro-card p-6 text-center space-y-2 border-dashed border-2 border-slate-200 bg-slate-50/50 rounded-3xl">
            <p className="text-sm font-bold text-slate-700">Vous n'avez pas encore de Juki assigné dans ce cycle.</p>
            <p className="text-xs text-slate-500">Sélectionnez ci-dessous 1 à 3 Jukis libres dans la grille pour vous engager.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAssignedJuki.map((item) => {
              const isDone = item.statut === 'Terminé' || item.statut === 'Validé';
              return (
                <div 
                  key={item.juz}
                  className={`pro-card p-5 border-2 rounded-3xl flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                    isDone
                      ? 'border-emerald-600 bg-emerald-50/40'
                      : 'border-emerald-700/80 bg-white shadow-soft'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-800 text-white shadow-xs">
                        Juki N° {item.juz}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                      }`}>
                        {item.statut}
                      </span>
                    </div>
                    <h4 className="font-display font-black text-sm text-slate-900 mt-1.5">
                      {item.nom_juz ? item.nom_juz.replace(/Juz'?/gi, 'Juki') : `Juki ${item.juz}`}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    {isDone ? (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-800 bg-white p-2.5 rounded-2xl border border-emerald-200 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Lecture complétée • Validée</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkCompleted(item.juz)}
                        className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>J'ai terminé la lecture</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION : SÉLECTIONNER DES JUKIS (GRILLE ÉPURÉE & PROFESSIONNELLE)
      ========================================================================= */}
      <div className="pro-card p-5 sm:p-7 space-y-5 rounded-3xl border border-slate-200 shadow-soft">
        
        {/* Header with Title, Counter & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-800" />
              <span>Choisir de nouveaux Jukis (1 à 3 max)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Cliquez sur les Jukis libres que vous souhaitez réciter dans ce cycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              selectedJukiForClaim.length > 0 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}>
              {selectedJukiForClaim.length} / 3 sélectionné(s)
            </span>

            {selectedJukiForClaim.length > 0 && (
              <button
                onClick={handleClaimJuki}
                disabled={isClaiming}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Confirmer</span>
              </button>
            )}
          </div>
        </div>

        {/* Professional 30-Juki Tile Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5">
          {assignations.map((item) => {
            const isMine = item.membre_id === currentUser?.id;
            const isTaken = !!item.membre_id && !isMine;
            const isAvailable = !item.membre_id || item.statut === 'À faire';
            const isSelected = selectedJukiForClaim.includes(item.juz);

            return (
              <button
                key={item.juz}
                type="button"
                disabled={isTaken || isMine}
                onClick={() => toggleSelectJuki(item.juz, isAvailable)}
                className={`relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between min-h-[76px] transition-all duration-150 border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-950 shadow-md scale-105 ring-2 ring-emerald-500/40 z-10'
                    : isMine
                    ? 'bg-emerald-50/70 text-emerald-900 border-emerald-300 opacity-90 cursor-default'
                    : isTaken
                    ? 'bg-slate-100/60 text-slate-400 border-slate-200/80 cursor-not-allowed opacity-60'
                    : 'bg-white hover:bg-emerald-50/40 text-slate-800 border-slate-200/90 hover:border-emerald-400 hover:shadow-xs active:scale-95'
                }`}
                title={
                  isSelected 
                    ? `Juki ${item.juz} sélectionné` 
                    : isMine 
                    ? `Juki ${item.juz} (Déjà le vôtre)` 
                    : isTaken 
                    ? `Juki ${item.juz} (Déjà pris par un autre membre)` 
                    : `Cliquer pour choisir le Juki ${item.juz}`
                }
              >
                {/* Juki Label */}
                <span className={`text-[10px] font-extrabold uppercase tracking-tight block ${
                  isSelected ? 'text-emerald-200' : 'text-slate-400'
                }`}>
                  Juki
                </span>

                {/* Big Number */}
                <span className={`font-display font-black text-lg sm:text-xl leading-none my-0.5 ${
                  isSelected ? 'text-white' : isMine ? 'text-emerald-900' : 'text-slate-900'
                }`}>
                  {item.juz < 10 ? `0${item.juz}` : item.juz}
                </span>

                {/* Status indicator badge */}
                <div className="mt-0.5">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Choisi</span>
                    </span>
                  ) : isMine ? (
                    <span className="text-[9px] font-black text-emerald-800">
                      Mon Juki
                    </span>
                  ) : isTaken ? (
                    <span className="text-[9px] font-semibold text-slate-400">
                      Pris
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200/60">
                      Libre
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-300"></span>
              <span className="text-slate-700">Libre ({availableJukiCount})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-800"></span>
              <span className="text-emerald-800 font-bold">Sélectionné</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span className="text-emerald-900">Mes Jukis ({myAssignedJuki.length})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200"></span>
              <span className="text-slate-400">Pris par d'autres</span>
            </span>
          </div>

          {selectedJukiForClaim.length > 0 && (
            <button
              onClick={handleClaimJuki}
              disabled={isClaiming}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Valider ({selectedJukiForClaim.length})</span>
            </button>
          )}
        </div>

      </div>

      {/* =========================================================================
          GRILLE COMPLÈTE DES 30 JUKIS DU SAINT CORAN
      ========================================================================= */}
      <div className="pro-card p-6 space-y-4 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-800" />
              <span>Grille collective des 30 Jukis</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Vue d'ensemble de la progression de tout le groupe.</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-700"></span>
              <span>Validé ({totalCompleted})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500"></span>
              <span>En cours</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-slate-200"></span>
              <span>Libre</span>
            </span>
          </div>
        </div>

        {/* 30 Jukis Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2.5 pt-2">
          {assignations.map((a) => {
            const isMine = a.membre_id === currentUser?.id;
            const isDone = a.statut === 'Terminé' || a.statut === 'Validé';
            const isPending = a.statut === 'En cours';

            return (
              <div
                key={a.juz}
                className={`p-2.5 rounded-2xl border text-center flex flex-col justify-between min-h-[68px] transition-all relative ${
                  isMine
                    ? 'ring-2 ring-emerald-600 shadow-soft-sm'
                    : ''
                } ${
                  isDone 
                    ? 'bg-emerald-700 text-white border-emerald-800' 
                    : isPending
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {isMine && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-800 text-white text-[9px] font-black flex items-center justify-center shadow">
                    ★
                  </span>
                )}
                <span className="text-[10px] font-extrabold opacity-80">Juki</span>
                <span className="text-base font-display font-black leading-none my-0.5">{a.juz}</span>
                <span className="text-[9px] font-bold truncate">
                  {isDone ? 'Lu' : isPending ? 'En cours' : 'Libre'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

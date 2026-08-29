import React, { useState } from 'react';
import { X, BarChart3, Calendar, CheckCircle2, Clock, XCircle, ShieldCheck, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const ResumeSeancesModal = ({ isOpen, onClose, defaultKourelId }) => {
  const { seances, kourels, khassidas, membres } = useApp();
  const [selectedKourelFilter, setSelectedKourelFilter] = useState(defaultKourelId || 'all');

  if (!isOpen) return null;

  // Filter seances based on kourel filter
  const filteredSeances = selectedKourelFilter === 'all'
    ? seances
    : seances.filter((s) => s.kourel_id === selectedKourelFilter);

  // Compute aggregated global stats
  let totalPresentsGlobal = 0;
  let totalRetardsGlobal = 0;
  let totalAbsentsGlobal = 0;
  let totalExpectedGlobal = 0;

  const seancesStats = filteredSeances.map((seance) => {
    const k = kourels.find((item) => item.id === seance.kourel_id);
    const kh = khassidas.find((item) => item.id === seance.khassida_id);
    const membersOfKourel = membres.filter((m) => m.kourel_id === seance.kourel_id);
    const totalMembersCount = membersOfKourel.length || seance.presences?.length || 0;

    let presents = 0;
    let retards = 0;
    let absents = 0;

    if (seance.presences && seance.presences.length > 0) {
      seance.presences.forEach((p) => {
        if (p.statut === 'Présent') presents++;
        else if (p.statut === 'En retard') retards++;
        else if (p.statut === 'Absent') absents++;
      });
    }

    const rate = totalMembersCount > 0 ? Math.round(((presents + retards) / totalMembersCount) * 100) : 0;

    totalPresentsGlobal += presents;
    totalRetardsGlobal += retards;
    totalAbsentsGlobal += absents;
    totalExpectedGlobal += totalMembersCount;

    return {
      ...seance,
      kourelNom: k ? k.nom : 'Kourel',
      khassidaTitre: kh ? kh.titre : 'Khassida non spécifiée',
      khassidaArabe: kh ? kh.titre_arabe : '',
      presents,
      retards,
      absents,
      totalMembersCount,
      rate
    };
  });

  const globalAssiduiteRate = totalExpectedGlobal > 0
    ? Math.round(((totalPresentsGlobal + totalRetardsGlobal) / totalExpectedGlobal) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Modal Header with Background Image */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md border border-emerald-600/40">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-white">
                Bilan & Émargement des Répétitions
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Statistiques consolidées d'assiduité et présence des Kourels
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Séances</span>
              <span className="font-display font-black text-xl text-slate-900 mt-1 block">{filteredSeances.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Présents</span>
              <span className="font-display font-black text-xl text-emerald-800 mt-1 block">{totalPresentsGlobal}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Retards</span>
              <span className="font-display font-black text-xl text-amber-800 mt-1 block">{totalRetardsGlobal}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-center">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">Taux Assiduité</span>
              <span className="font-display font-black text-xl text-white mt-1 block">{globalAssiduiteRate}%</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-2xl">
            <Filter className="w-4 h-4 text-slate-500 ml-2" />
            <span className="text-xs font-bold text-slate-700">Filtrer par Kourel :</span>
            <select
              value={selectedKourelFilter}
              onChange={(e) => setSelectedKourelFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs border border-slate-200 focus:outline-none"
            >
              <option value="all">Tous les Kourels</option>
              {kourels.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nom}
                </option>
              ))}
            </select>
          </div>

          {/* List of Sessions */}
          <div className="space-y-3">
            {seancesStats.map((s) => (
              <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {s.kourelNom}
                    </span>
                    <h4 className="font-display font-black text-sm text-slate-900 mt-1">
                      Séance du {s.date} ({s.heure_debut} - {s.heure_fin})
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-base text-emerald-800">{s.rate}%</span>
                    <span className="text-[10px] text-slate-400 block font-medium">d'assiduité</span>
                  </div>
                </div>

                <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div>
                    Khassida : <strong className="text-slate-800">{s.khassidaTitre}</strong>
                    {s.khassidaArabe && <span className="text-emerald-700 font-serif font-bold ml-1">({s.khassidaArabe})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 font-bold">{s.presents} présents</span>
                    <span>•</span>
                    <span className="text-amber-700 font-bold">{s.retards} retards</span>
                    <span>•</span>
                    <span className="text-rose-700 font-bold">{s.absents} absents</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
          >
            Fermer le bilan
          </button>
        </div>

      </div>
    </div>
  );
};

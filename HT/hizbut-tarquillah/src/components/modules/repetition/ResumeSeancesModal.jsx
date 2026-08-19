import React, { useState } from 'react';
import { X, BarChart3, Calendar, CheckCircle2, Clock, XCircle, ShieldCheck, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-ht-line shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-ht-line flex items-center justify-between gradient-emerald text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Résumé & Synthèse des Séances de Pointage
              </h3>
              <p className="text-xs text-white/80">Statistiques globales de présence et d'assiduité par séance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Kourel Filter Bar & Global Stat Summary Tiles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-ht-page/60 p-4 rounded-2xl border border-ht-line">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-ht-sage" />
              <span className="text-xs font-semibold text-ht-ink">Filtrer par Kourel :</span>
              <select
                value={selectedKourelFilter}
                onChange={(e) => setSelectedKourelFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              >
                <option value="all">Tous les Kourels</option>
                {kourels.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-semibold text-ht-sage">
              <span className="text-ht-ink font-bold">{filteredSeances.length}</span> séance(s) analysée(s)
            </div>
          </div>

          {/* Aggregated Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-ht-mist rounded-2xl p-4 border border-ht-mint text-center">
              <div className="flex items-center justify-center gap-1.5 text-ht-emerald font-bold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{totalPresentsGlobal}</span>
              </div>
              <div className="text-[11px] font-semibold text-ht-sage">Présences totales</div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-ht-amber font-bold text-sm mb-1">
                <Clock className="w-4 h-4" />
                <span>{totalRetardsGlobal}</span>
              </div>
              <div className="text-[11px] font-semibold text-ht-sage">Retards totaux</div>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-ht-clay font-bold text-sm mb-1">
                <XCircle className="w-4 h-4" />
                <span>{totalAbsentsGlobal}</span>
              </div>
              <div className="text-[11px] font-semibold text-ht-sage">Absences totales</div>
            </div>

            <div className="gradient-emerald text-white rounded-2xl p-4 text-center shadow-xs">
              <div className="font-extrabold text-base mb-1">{globalAssiduiteRate}%</div>
              <div className="text-[11px] font-semibold text-white/90">Assiduité Moyenne</div>
            </div>
          </div>

          {/* Detailed Seance Breakdown Table */}
          <div className="bg-white rounded-2xl border border-ht-line overflow-hidden shadow-soft">
            <div className="p-4 bg-ht-page border-b border-ht-line flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-ht-ink">
                Détail Chiffré par Séance (Sans noms des membres)
              </h4>
              <span className="text-[11px] text-ht-sage font-medium">Synthèse globale</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ht-page/50 border-b border-ht-line text-[11px] font-semibold text-ht-sage uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date & Séance</th>
                    <th className="py-3.5 px-4">Kourel & Khassida</th>
                    <th className="py-3.5 px-4 text-center">Présents</th>
                    <th className="py-3.5 px-4 text-center">Retards</th>
                    <th className="py-3.5 px-4 text-center">Absents</th>
                    <th className="py-3.5 px-4 text-center">Assiduité</th>
                    <th className="py-3.5 px-4 text-right">Superviseur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ht-line text-xs font-medium text-ht-ink">
                  {seancesStats.length > 0 ? (
                    seancesStats.map((s) => (
                      <tr key={s.id} className="hover:bg-ht-mist/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-ht-ink flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-ht-emerald" />
                            <span>{s.date}</span>
                          </div>
                          <div className="text-[10px] text-ht-sage mt-0.5">
                            {s.heure_debut} - {s.heure_fin}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-ht-emerald">{s.kourelNom}</div>
                          <div className="text-[11px] text-ht-inkSoft truncate max-w-[180px]">
                            {s.khassidaTitre}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-ht-mist text-ht-emerald rounded-lg font-bold border border-ht-mint inline-block min-w-[36px]">
                            {s.presents}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-amber-50 text-ht-amber rounded-lg font-bold border border-amber-200 inline-block min-w-[36px]">
                            {s.retards}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-red-50 text-ht-clay rounded-lg font-bold border border-red-200 inline-block min-w-[36px]">
                            {s.absents}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-lg font-extrabold text-xs text-white ${
                              s.rate >= 75
                                ? 'bg-ht-emerald'
                                : s.rate >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {s.rate}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 text-[11px] text-ht-sage">
                            <ShieldCheck className="w-3.5 h-3.5 text-ht-emerald" />
                            <span>{s.superviseur || 'N/A'}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-ht-sage italic">
                        Aucune séance enregistrée pour ce kourel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-ht-line bg-ht-page/50 flex items-center justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Fermer le résumé
          </button>
        </div>
      </div>
    </div>
  );
};

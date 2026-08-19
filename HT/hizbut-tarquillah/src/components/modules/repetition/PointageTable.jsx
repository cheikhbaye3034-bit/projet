import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, UserCheck, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PointageRapideModal } from './PointageRapideModal';

export const PointageTable = ({ seance, membersOfKourel }) => {
  const { updatePointage, bulkUpdatePointage, currentUser } = useApp();

  const [isRapideModalOpen, setIsRapideModalOpen] = useState(false);
  const [targetStatut, setTargetStatut] = useState('Présent');

  if (!seance) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-ht-line shadow-soft text-center text-ht-sage text-sm italic">
        Veuillez sélectionner une séance pour effectuer ou consulter le pointage.
      </div>
    );
  }

  const openRapideModal = (statut) => {
    setTargetStatut(statut);
    setIsRapideModalOpen(true);
  };

  // Calculate stats for current seance pointage
  const totalMembers = membersOfKourel.length;
  let presents = 0;
  let retards = 0;
  let absents = 0;

  membersOfKourel.forEach((m) => {
    const p = seance.presences?.find((item) => item.membre_id === m.id);
    if (p) {
      if (p.statut === 'Présent') presents++;
      else if (p.statut === 'En retard') retards++;
      else if (p.statut === 'Absent') absents++;
    }
  });

  const seanceRate = totalMembers > 0 ? Math.round(((presents + retards) / totalMembers) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-ht-line shadow-soft overflow-hidden">
      {/* Header bar with supervisor notice and attendance metrics */}
      <div className="p-6 border-b border-ht-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-ht-page/50">
        <div>
          <div className="flex items-center gap-2 text-xs text-ht-emerald font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Pointage géré par {seance.superviseur || currentUser.prenom + ' ' + currentUser.nom}</span>
          </div>
          <h3 className="font-display font-bold text-lg text-ht-ink mt-1">
            Feuille de Présence — Séance du {seance.date} ({seance.heure_debut} - {seance.heure_fin})
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-ht-mist rounded-xl border border-ht-mint text-xs font-bold text-ht-emerald">
            {presents} Présent(s)
          </div>
          <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-ht-amber">
            {retards} Retard(s)
          </div>
          <div className="px-3 py-1.5 bg-red-50 rounded-xl border border-red-200 text-xs font-bold text-ht-clay">
            {absents} Absent(s)
          </div>
          <div className="px-3.5 py-1.5 gradient-emerald text-white rounded-xl text-xs font-bold shadow-sm">
            {seanceRate}% Assiduité
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar for Bulk & Interactive Pointage */}
      <div className="p-4 bg-ht-page/80 border-b border-ht-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-ht-amber" />
          <span className="text-xs font-bold text-ht-ink">Saisie Rapide des Présences & Retards :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => openRapideModal('Présent')}
            className="btn-anim px-4 py-2 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            title="Saisir / Cocher les membres présents"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Pointer les Présents</span>
          </button>

          <button
            onClick={() => openRapideModal('En retard')}
            className="btn-anim px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            title="Saisir / Cocher les membres en retard"
          >
            <Clock className="w-4 h-4" />
            <span>Pointer les Retards</span>
          </button>
        </div>
      </div>

      {/* Pointage Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ht-page border-b border-ht-line text-[11px] font-semibold text-ht-sage uppercase tracking-wider">
              <th className="py-4 px-6">Membre</th>
              <th className="py-4 px-6">Heure d'arrivée</th>
              <th className="py-4 px-6">Statut Pointage</th>
              <th className="py-4 px-6 text-right">Actions rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ht-line text-sm text-ht-ink font-medium">
            {membersOfKourel.map((membre) => {
              const presence = seance.presences?.find((p) => p.membre_id === membre.id);
              const currentStatut = presence?.statut || 'Non pointé';
              const heureArrivee = presence?.heure_arrivee || '';

              return (
                <tr key={membre.id} className="hover:bg-ht-mist/30 transition-colors">
                  {/* Membre details */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold text-xs border border-ht-mint">
                        {membre.prenom[0]}{membre.nom[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-ht-ink">
                          {membre.prenom} {membre.nom}
                        </div>
                        <div className="text-[11px] text-ht-sage">{membre.telephone}</div>
                      </div>
                    </div>
                  </td>

                  {/* Heure d'arrivée input */}
                  <td className="py-4 px-6">
                    <input
                      type="time"
                      value={heureArrivee}
                      onChange={(e) => updatePointage(seance.id, membre.id, 'En retard', e.target.value)}
                      className="px-2.5 py-1.5 bg-ht-page border border-ht-line rounded-lg text-xs font-medium text-ht-ink focus:outline-none focus:border-ht-fern"
                    />
                  </td>

                  {/* Current Statut Badge */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1 ${
                        currentStatut === 'Présent'
                          ? 'badge-present'
                          : currentStatut === 'En retard'
                          ? 'badge-retard'
                          : currentStatut === 'Absent'
                          ? 'badge-absent'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {currentStatut === 'Présent' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {currentStatut === 'En retard' && <Clock className="w-3.5 h-3.5" />}
                      {currentStatut === 'Absent' && <XCircle className="w-3.5 h-3.5" />}
                      <span>{currentStatut}</span>
                    </span>
                  </td>

                  {/* 1-Click Action Buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'Présent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatut === 'Présent'
                            ? 'bg-ht-emerald text-white shadow-sm'
                            : 'bg-ht-mist text-ht-emerald hover:bg-ht-mint border border-ht-mint'
                        }`}
                      >
                        Présent
                      </button>

                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'En retard', '20:15')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatut === 'En retard'
                            ? 'bg-ht-amber text-white shadow-sm'
                            : 'bg-amber-50 text-ht-amber hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        En retard
                      </button>

                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentStatut === 'Absent'
                            ? 'bg-ht-clay text-white shadow-sm'
                            : 'bg-red-50 text-ht-clay hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Interactive Rapid Pointage Modal */}
      <PointageRapideModal
        isOpen={isRapideModalOpen}
        onClose={() => setIsRapideModalOpen(false)}
        seance={seance}
        membersOfKourel={membersOfKourel}
        statutTarget={targetStatut}
      />
    </div>
  );
};

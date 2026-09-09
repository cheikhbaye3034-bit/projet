import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, UserCheck, ShieldCheck, Zap, Search } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PointageRapideModal } from './PointageRapideModal';

export const PointageTable = ({ seance, membersOfKourel }) => {
  const { updatePointage, bulkUpdatePointage, currentUser } = useApp();

  const [isRapideModalOpen, setIsRapideModalOpen] = useState(false);
  const [targetStatut, setTargetStatut] = useState('Présent');
  const [filterSearch, setFilterSearch] = useState('');

  if (!seance) {
    return (
      <div className="pro-card p-12 text-center text-slate-400 text-xs italic">
        Veuillez sélectionner une séance pour effectuer ou consulter le pointage.
      </div>
    );
  }

  const openRapideModal = (statut) => {
    setTargetStatut(statut);
    setIsRapideModalOpen(true);
  };

  // Calculate stats for current seance pointage
  const totalMembers = membersOfKourel ? membersOfKourel.length : 0;
  let presents = 0;
  let retards = 0;
  let absents = 0;

  (membersOfKourel || []).forEach((m) => {
    const p = seance.presences?.find((item) => item.membre_id === m.id);
    if (p) {
      if (p.statut === 'Présent') presents++;
      else if (p.statut === 'En retard') retards++;
      else if (p.statut === 'Absent') absents++;
    }
  });

  const seanceRate = totalMembers > 0 ? Math.round(((presents + retards) / totalMembers) * 100) : 0;

  const filteredMembers = (membersOfKourel || []).filter((m) =>
    `${m.prenom} ${m.nom}`.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <div className="pro-card overflow-hidden">
      {/* Header bar with attendance metrics */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Feuille supervisée par {seance.superviseur || `${currentUser?.prenom || ''} ${currentUser?.nom || ''}`}</span>
          </div>
          <h3 className="font-display font-black text-base sm:text-lg text-slate-900 mt-1">
            Séance du {seance.date} • {seance.heure_debut} à {seance.heure_fin}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-black text-emerald-800 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {presents} Présent{presents > 1 ? 's' : ''}
          </div>
          <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-black text-amber-800 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {retards} Retard{retards > 1 ? 's' : ''}
          </div>
          <div className="px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200 text-xs font-black text-rose-800 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {absents} Absent{absents > 1 ? 's' : ''}
          </div>
          <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-soft-xs">
            {seanceRate}% Taux
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer un membre par son nom ou prénom..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 font-semibold transition-all"
          />
        </div>

        {/* Bulk pointage triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openRapideModal('Présent')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Pointer Présents</span>
          </button>

          <button
            onClick={() => openRapideModal('En retard')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-200" />
            <span>Pointer Retards</span>
          </button>
        </div>
      </div>

      {/* Mobile Pointage Card List (Touch-First with Large Buttons) */}
      <div className="md:hidden divide-y divide-slate-100">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((membre) => {
            const presence = seance.presences?.find((p) => p.membre_id === membre.id);
            const currentStatut = presence?.statut || 'Non pointé';
            const heureArrivee = presence?.heure_arrivee || '';

            return (
              <div key={membre.id} className="p-4 bg-white space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-black text-xs shadow-xs flex-shrink-0">
                      {membre.prenom?.[0] || 'M'}{membre.nom?.[0] || 'B'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-black text-sm text-slate-900 leading-tight truncate">
                        {membre.prenom} {membre.nom}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">{membre.telephone || 'Membre Kourel'}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg inline-flex items-center gap-1 flex-shrink-0 ${
                      currentStatut === 'Présent'
                        ? 'bg-emerald-100 text-emerald-900'
                        : currentStatut === 'En retard'
                        ? 'bg-amber-100 text-amber-900'
                        : currentStatut === 'Absent'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {currentStatut === 'Présent' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {currentStatut === 'En retard' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {currentStatut === 'Absent' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{currentStatut}</span>
                  </span>
                </div>

                {/* 3 Touch-First Action Buttons (44px target) */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'Présent')}
                    className={`py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatut === 'Présent'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Présent</span>
                  </button>

                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'En retard', '20:15')}
                    className={`py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatut === 'En retard'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Retard</span>
                  </button>

                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'Absent')}
                    className={`py-3 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      currentStatut === 'Absent'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-rose-50 text-rose-900 border border-rose-200/80 hover:bg-rose-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Absent</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs italic">
            Aucun membre trouvé pour cette recherche.
          </div>
        )}
      </div>

      {/* Desktop Pointage Members Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">Membre</th>
              <th className="py-3.5 px-6">Heure d'arrivée</th>
              <th className="py-3.5 px-6">Statut</th>
              <th className="py-3.5 px-6 text-right">Actions rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-medium">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((membre) => {
                const presence = seance.presences?.find((p) => p.membre_id === membre.id);
                const currentStatut = presence?.statut || 'Non pointé';
                const heureArrivee = presence?.heure_arrivee || '';

                return (
                  <tr key={membre.id} className="hover:bg-emerald-50/40 transition-colors">
                    {/* Membre details */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {membre.prenom?.[0] || 'M'}{membre.nom?.[0] || 'B'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            {membre.prenom} {membre.nom}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {membre.telephone || 'Non renseigné'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Heure d'arrivée */}
                    <td className="py-3.5 px-6">
                      {currentStatut === 'En retard' ? (
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          {heureArrivee || '20:15'}
                        </span>
                      ) : currentStatut === 'Présent' ? (
                        <span className="font-mono text-slate-500">
                          {heureArrivee || seance.heure_debut || '20:00'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    {/* Statut Badge */}
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          currentStatut === 'Présent'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : currentStatut === 'En retard'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : currentStatut === 'Absent'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {currentStatut === 'Présent' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {currentStatut === 'En retard' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {currentStatut === 'Absent' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        <span>{currentStatut}</span>
                      </span>
                    </td>

                    {/* Quick 1-Click Action Buttons */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updatePointage(seance.id, membre.id, 'Présent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatut === 'Présent'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200'
                          }`}
                          title="Marquer Présent"
                        >
                          P
                        </button>
                        <button
                          onClick={() => updatePointage(seance.id, membre.id, 'En retard', '20:15')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatut === 'En retard'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200'
                          }`}
                          title="Marquer En Retard"
                        >
                          R
                        </button>
                        <button
                          onClick={() => updatePointage(seance.id, membre.id, 'Absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatut === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-slate-200'
                          }`}
                          title="Marquer Absent"
                        >
                          A
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 text-xs italic">
                  Aucun membre ne correspond à cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pointage Rapide Selection Modal */}
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

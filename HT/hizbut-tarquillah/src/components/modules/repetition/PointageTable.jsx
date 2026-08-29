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

  membersOfKourel.forEach((m) => {
    const p = seance.presences?.find((item) => item.membre_id === m.id);
    if (p) {
      if (p.statut === 'Présent') presents++;
      else if (p.statut === 'En retard') retards++;
      else if (p.statut === 'Absent') absents++;
    }
  });

  const seanceRate = totalMembers > 0 ? Math.round(((presents + retards) / totalMembers) * 100) : 0;

  const filteredMembers = membersOfKourel.filter((m) =>
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
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer un membre..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
          />
        </div>

        {/* Bulk pointage triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openRapideModal('Présent')}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
            <span>Pointer les Présents</span>
          </button>

          <button
            onClick={() => openRapideModal('En retard')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            <span>Pointer les Retards</span>
          </button>
        </div>

        {/* Mobile Pointage Card List (Touch-First with Large Buttons) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredMembers.map((membre) => {
            const presence = seance.presences?.find((p) => p.membre_id === membre.id);
            const currentStatut = presence?.statut || 'Non pointé';
            const heureArrivee = presence?.heure_arrivee || '';

            return (
              <div key={membre.id} className="p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      {membre.prenom[0]}{membre.nom[0]}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm text-slate-900 leading-tight">
                        {membre.prenom} {membre.nom}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{membre.telephone || 'Membre'}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-black rounded-lg inline-flex items-center gap-1 ${
                      currentStatut === 'Présent'
                        ? 'bg-emerald-100 text-emerald-900'
                        : currentStatut === 'En retard'
                        ? 'bg-amber-100 text-amber-900'
                        : currentStatut === 'Absent'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {currentStatut === 'Présent' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {currentStatut === 'En retard' && <Clock className="w-3 h-3 text-amber-600" />}
                    {currentStatut === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                    <span>{currentStatut}</span>
                  </span>
                </div>

                {/* 3 Touch-First Action Buttons (44px target) */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'Présent')}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      currentStatut === 'Présent'
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Présent</span>
                  </button>

                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'En retard', '20:15')}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      currentStatut === 'En retard'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Retard</span>
                  </button>

                  <button
                    onClick={() => updatePointage(seance.id, membre.id, 'Absent')}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                      currentStatut === 'Absent'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-rose-50 text-rose-900 border border-rose-200/80 hover:bg-rose-100'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Absent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
            {filteredMembers.map((membre) => {
              const presence = seance.presences?.find((p) => p.membre_id === membre.id);
              const currentStatut = presence?.statut || 'Non pointé';
              const heureArrivee = presence?.heure_arrivee || '';

              return (
                <tr key={membre.id} className="hover:bg-emerald-50/40 transition-colors">
                  {/* Membre details */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                        {membre.prenom[0]}{membre.nom[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {membre.prenom} {membre.nom}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{membre.telephone || membre.matricule}</div>
                      </div>
                    </div>
                  </td>

                  {/* Heure d'arrivée */}
                  <td className="py-3.5 px-6">
                    <input
                      type="time"
                      value={heureArrivee}
                      onChange={(e) => updatePointage(seance.id, membre.id, 'En retard', e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-600"
                    />
                  </td>

                  {/* Current Statut Badge */}
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${
                        currentStatut === 'Présent'
                          ? 'badge-present'
                          : currentStatut === 'En retard'
                          ? 'badge-retard'
                          : currentStatut === 'Absent'
                          ? 'badge-absent'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {currentStatut === 'Présent' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {currentStatut === 'En retard' && <Clock className="w-3 h-3 text-amber-600" />}
                      {currentStatut === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{currentStatut}</span>
                    </span>
                  </td>

                  {/* 1-Click Action Buttons */}
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'Présent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatut === 'Présent'
                            ? 'bg-emerald-800 text-white shadow-soft-xs'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        Présent
                      </button>

                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'En retard', '20:15')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatut === 'En retard'
                            ? 'bg-amber-600 text-white shadow-soft-xs'
                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        Retard
                      </button>

                      <button
                        onClick={() => updatePointage(seance.id, membre.id, 'Absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          currentStatut === 'Absent'
                            ? 'bg-rose-600 text-white shadow-soft-xs'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
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

      {/* Pointage Rapide Selection Modal */}
      <PointageRapideModal
        isOpen={isRapideModalOpen}
        onClose={() => setIsRapideModalOpen(false)}
        seanceId={seance.id}
        membersOfKourel={membersOfKourel}
        statut={targetStatut}
      />
    </div>
  );
};

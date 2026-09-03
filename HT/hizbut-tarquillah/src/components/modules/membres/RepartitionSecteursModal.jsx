import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  RefreshCw, 
  CheckCircle2, 
  Search, 
  Users, 
  ChevronRight, 
  Layers,
  Sparkles,
  Check,
  Building,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const RepartitionSecteursModal = ({ isOpen, onClose }) => {
  const { membres, secteurs, updateMembreSecteur, bulkAssignSecteur, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSecteurFilter, setSelectedSecteurFilter] = useState('all');

  if (!isOpen) return null;

  const activeMembres = (membres || []).filter(m => m.statut === 'Actif');

  const handleAutoDistribute = () => {
    if (activeMembres.length === 0 || secteurs.length === 0) return;
    
    activeMembres.forEach((m, index) => {
      const targetSecteur = secteurs[index % secteurs.length];
      updateMembreSecteur(m.id, targetSecteur.id);
    });

    showToast('⚡ Auto-répartition équitable effectuée avec succès sur tous les secteurs !');
  };

  // Filtered members
  const filteredMembres = (membres || []).filter((m) => {
    const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
    const phone = m.telephone;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || fullName.includes(q) || phone.includes(q);
    const matchesSecteur = selectedSecteurFilter === 'all' || m.secteur_id === selectedSecteurFilter;
    return matchesSearch && matchesSecteur;
  });

  const totalAssigned = (membres || []).filter(m => m.secteur_id).length;
  const totalUnassigned = (membres || []).length - totalAssigned;

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-start p-0 sm:p-4 lg:p-6 overflow-hidden animate-fade-in select-none">
      {/* Fullscreen / Full-Page Card Container */}
      <div className="w-full h-full max-w-5xl bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-scale-up">
        
        {/* ── Top Header Banner (Dark Emerald Hero) ── */}
        <div className="relative p-5 sm:p-7 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-4 relative z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600/50 flex items-center justify-center shadow-inner flex-shrink-0">
              <Briefcase className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                Commissions & Organisation
              </span>
              <h2 className="font-display font-black text-lg sm:text-2xl text-white mt-0.5">
                Répartition des Membres par Secteur
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Summary & Quick Auto-Distribution CTA ── */}
        <div className="p-4 sm:p-5 bg-emerald-50/80 border-b border-emerald-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <UserCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <p className="text-slate-700 font-medium leading-snug">
              <strong className="text-emerald-800 font-bold">{totalAssigned}</strong> membre(s) affecté(s) • <strong className="text-amber-700 font-bold">{totalUnassigned}</strong> en attente d'affectation.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAutoDistribute}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-emerald-300" />
            <span>✨ Répartir Équitablement</span>
          </button>
        </div>

        {/* ── Sectors Horizontal Filter Chips ── */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setSelectedSecteurFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border ${
              selectedSecteurFilter === 'all'
                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tous les Secteurs ({secteurs.length})</span>
          </button>

          {secteurs.map((s) => {
            const count = (membres || []).filter(m => m.secteur_id === s.id).length;
            const isSelected = selectedSecteurFilter === s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSecteurFilter(isSelected ? 'all' : s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                }`}
              >
                <Building className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>{s.nom.split('&')[0]}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Search Toolbar ── */}
        <div className="p-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par prénom, nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* ── Member Allocation Table ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Membre</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Téléphone</th>
                  <th className="py-3.5 px-4 sm:px-6">Secteur / Commission attribué(e)</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-800 font-medium">
                {filteredMembres.length > 0 ? (
                  filteredMembres.map((m) => {
                    const hasSecteur = !!m.secteur_id;

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Membre */}
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                              {m.prenom[0]}{m.nom[0]}
                            </div>
                            <div>
                              <p className="font-display font-bold text-xs sm:text-sm text-slate-900">
                                {m.prenom} {m.nom}
                              </p>
                              <p className="text-[11px] text-slate-400 font-normal sm:hidden">
                                {m.telephone}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-slate-600 hidden sm:table-cell">
                          {m.telephone}
                        </td>

                        {/* Sector Dropdown Selector */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <select
                            value={m.secteur_id || ''}
                            onChange={(e) => updateMembreSecteur(m.id, e.target.value)}
                            className="w-full max-w-sm p-2.5 bg-slate-50 border border-slate-200 hover:border-emerald-400 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors cursor-pointer shadow-xs"
                          >
                            <option value="">-- Non affecté --</option>
                            {secteurs.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nom} ({s.code})
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Status indicator */}
                        <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                          {hasSecteur ? (
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-black rounded-xl border border-emerald-200 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Affecté</span>
                            </span>
                          ) : (
                            <span className="px-3 py-1.5 bg-amber-50 text-amber-800 text-xs font-black rounded-xl border border-amber-200">
                              En attente
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 text-xs italic">
                      Aucun membre trouvé correspondant aux critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between text-xs sm:text-sm flex-shrink-0">
          <span className="text-slate-500 font-medium hidden sm:inline">
            💡 Les modifications de secteur s'enregistrent automatiquement en temps réel.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all ml-auto"
          >
            Terminer & Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Users, CheckCircle2, RefreshCw, X, Search, Check, Sparkles, BookOpen, ChevronDown } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroKamilBg from '../../../assets/images/kamil_hero_quran.jpg';

export const AttributionJukiModal = ({ isOpen, onClose }) => {
  const { kamilCycle, membres, kourels, assignJuzToMembre, showToast } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedKourelFilter, setSelectedKourelFilter] = useState('all');

  if (!isOpen) return null;

  const activeMembres = (membres || []).filter(m => m.statut === 'Actif');

  const handleAutoDistribute = () => {
    if (activeMembres.length === 0) {
      showToast && showToast('Aucun membre actif disponible pour la distribution.', 'error');
      return;
    }
    kamilCycle?.assignations?.forEach((item, index) => {
      const assignedMembre = activeMembres[index % activeMembres.length];
      assignJuzToMembre(item.juz, assignedMembre.id);
    });
    showToast && showToast('✨ Répartition automatique équitable effectuée pour les 30 Jukis !');
  };

  const filteredAssignations = (kamilCycle?.assignations || []).filter(item => {
    const membre = membres?.find(m => m.id === item.membre_id);
    const memberName = membre ? `${membre.prenom} ${membre.nom}` : '';
    const q = filterQuery.toLowerCase();
    const matchesQuery = !q || `juki ${item.juz}`.includes(q) || `${item.juz}`.includes(q) || memberName.toLowerCase().includes(q) || (item.nom_juz && item.nom_juz.toLowerCase().includes(q));
    const matchesKourel = selectedKourelFilter === 'all' || (membre && membre.kourel_id === selectedKourelFilter);
    return matchesQuery && matchesKourel;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[500] animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header with Dark Emerald Background Pattern */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroKamilBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md border border-emerald-600/40 flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Attribution des 30 Jukis
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Affectez chaque portion du Coran au membre responsable de sa récitation
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

        {/* Toolbar: Search & Auto Distribute CTA */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer par Juki ou nom de lecteur..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedKourelFilter}
              onChange={(e) => setSelectedKourelFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Tous les Kourels</option>
              {(kourels || []).map(k => (
                <option key={k.id} value={k.id}>{k.nom}</option>
              ))}
            </select>

            <button
              onClick={handleAutoDistribute}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Répartition Auto</span>
              <span className="sm:hidden">Auto</span>
            </button>
          </div>
        </div>

        {/* Assignments Table List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider pb-2">
                <th className="py-2.5 px-3">Portion Coran</th>
                <th className="py-2.5 px-3">Membre Assigné</th>
                <th className="py-2.5 px-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAssignations.map((item) => {
                const assignedMembre = membres?.find(m => m.id === item.membre_id);
                const isTermine = item.statut === 'Terminé';

                return (
                  <tr key={item.juz} className="hover:bg-slate-50/80 transition-colors">
                    {/* Portion info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-display font-black text-xs flex items-center justify-center">
                          {item.juz}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">Juki {item.juz}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[180px] sm:max-w-xs">
                            {item.nom_juz || `Juz ${item.juz}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Member Select Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={item.membre_id || ''}
                        onChange={(e) => assignJuzToMembre(item.juz, e.target.value)}
                        className={`w-full max-w-xs px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          item.membre_id 
                            ? 'bg-white border-slate-200 text-slate-900 focus:border-emerald-600' 
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                      >
                        <option value="">-- Sélectionner un lecteur --</option>
                        {(membres || []).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.prenom} {m.nom} ({m.telephone || 'Membre'})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Statut Badge */}
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        isTermine 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                          : item.statut === 'En cours'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isTermine && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        <span>{item.statut}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-900">{kamilCycle?.assignations?.filter(a => a.membre_id).length || 0} / 30</strong> Jukis assignés
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Fermer & Enregistrer
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Users, CheckCircle2, RefreshCw, X, Search, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AttributionJukiModal = ({ isOpen, onClose }) => {
  const { kamilCycle, membres, kourels, assignJuzToMembre, showToast } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  // Active Juki row for inline member search popover
  const [activeSearchJuz, setActiveSearchJuz] = useState(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  if (!isOpen) return null;

  const activeMembres = membres.filter(m => m.statut === 'Actif');

  const handleAutoDistribute = () => {
    if (activeMembres.length === 0) return;
    kamilCycle.assignations.forEach((item, index) => {
      const assignedMembre = activeMembres[index % activeMembres.length];
      assignJuzToMembre(item.juz, assignedMembre.id);
    });
    showToast('✨ Répartition automatique équitable effectuée pour les 30 Juki !');
  };

  const filteredAssignations = kamilCycle.assignations.filter(item => {
    const membre = membres.find(m => m.id === item.membre_id);
    const memberName = membre ? `${membre.prenom} ${membre.nom}` : '';
    const q = filterQuery.toLowerCase();
    return (
      `juki ${item.juz}`.includes(q) ||
      `${item.juz}`.includes(q) ||
      memberName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-ht-line flex flex-col overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-ht-line flex items-center justify-between bg-ht-page/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-emerald text-white flex items-center justify-center font-bold border border-ht-mint shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-ht-ink">
                Attribution & Affectation des 30 Juki
              </h3>
              <p className="text-xs text-ht-emerald font-semibold mt-0.5">
                Affectez chaque portion du Coran au membre responsable de sa récitation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-ht-mist text-gray-500 font-bold flex items-center justify-center border border-ht-line transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search & Auto Distribute CTA */}
        <div className="p-5 border-b border-ht-line bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer la liste des 30 Juki..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>

          <button
            onClick={handleAutoDistribute}
            className="btn-anim px-4 py-2.5 bg-ht-mist text-ht-emerald border border-ht-mint rounded-2xl text-xs font-bold hover:bg-ht-mint flex items-center justify-center gap-2 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>✨ Répartir Automatiquement</span>
          </button>
        </div>

        {/* Assignments Table List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ht-line text-[11px] font-extrabold text-ht-sage uppercase tracking-wider pb-3">
                <th className="py-3 px-4">Portion Coran</th>
                <th className="py-3 px-4">Membre Responsable</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Confirmation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ht-line text-sm">
              {filteredAssignations.map((item) => {
                const isTermine = item.statut === 'Terminé';
                const isInProgress = item.statut === 'En cours';
                const currentMembre = membres.find(m => m.id === item.membre_id);
                const isSearchActive = activeSearchJuz === item.juz;

                // Filtered members list for inline search input
                const searchedMembersList = membres.filter(m => {
                  const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
                  return fullName.includes(memberSearchQuery.toLowerCase());
                });

                return (
                  <tr key={item.juz} className="hover:bg-ht-mist/40 transition-colors">
                    {/* Juki Pill */}
                    <td className="py-3.5 px-4 font-bold text-ht-ink">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center border shadow-xs ${
                          isTermine
                            ? 'bg-ht-emerald text-white border-ht-emerald'
                            : isInProgress
                            ? 'bg-ht-mint text-ht-emerald border-ht-sage'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}>
                          {item.juz}
                        </div>
                        <span className="font-extrabold text-sm">Juki {item.juz}</span>
                      </div>
                    </td>

                    {/* Member Selector with Interactive Search Input Popover */}
                    <td className="py-3.5 px-4 relative">
                      <div className="relative w-full max-w-xs">
                        {/* Selector Trigger Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isSearchActive) {
                              setActiveSearchJuz(null);
                            } else {
                              setActiveSearchJuz(item.juz);
                              setMemberSearchQuery('');
                            }
                          }}
                          className="w-full p-2.5 bg-ht-page hover:bg-ht-mist border border-ht-line hover:border-ht-mint rounded-xl text-xs font-semibold text-ht-ink flex items-center justify-between shadow-xs transition-colors"
                        >
                          <span className="truncate">
                            {currentMembre ? `${currentMembre.prenom} ${currentMembre.nom}` : 'Sélectionner un membre'}
                          </span>
                          <div className="flex items-center gap-1 text-ht-emerald font-bold bg-ht-mist p-1 rounded-lg border border-ht-mint ml-2 flex-shrink-0">
                            <Search className="w-3.5 h-3.5 text-ht-emerald" />
                          </div>
                        </button>

                        {/* Interactive Search Popover Panel */}
                        {isSearchActive && (
                          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-2xl border border-ht-mint shadow-2xl p-3 z-30 space-y-2 animate-fade-in">
                            {/* Live Search Input Bar */}
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-ht-emerald absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                autoFocus
                                placeholder="🔍 Taper un prénom ou nom..."
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-7 py-2 bg-ht-page border border-ht-mint rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald font-semibold"
                              />
                              {memberSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setMemberSearchQuery('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xs"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            {/* Scrollable Member Options List */}
                            <div className="max-h-48 overflow-y-auto space-y-1 text-xs">
                              {searchedMembersList.length > 0 ? (
                                searchedMembersList.map((m) => {
                                  const k = kourels.find(k => k.id === m.kourel_id);
                                  const kourelName = k ? k.nom.split('—')[1] || k.nom : 'Kourel';
                                  const isSelected = item.membre_id === m.id;

                                  return (
                                    <div
                                      key={m.id}
                                      onClick={() => {
                                        assignJuzToMembre(item.juz, m.id);
                                        setActiveSearchJuz(null);
                                      }}
                                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                                        isSelected ? 'bg-ht-mist text-ht-emerald font-bold border border-ht-mint' : 'hover:bg-ht-page text-ht-ink'
                                      }`}
                                    >
                                      <div>
                                        <div className="font-bold">{m.prenom} {m.nom}</div>
                                        <div className="text-[10px] text-ht-sage">{kourelName} • {m.telephone}</div>
                                      </div>
                                      {isSelected && <Check className="w-4 h-4 text-ht-emerald" />}
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="p-3 text-center text-xs text-ht-sage italic">
                                  Aucun membre trouvé pour "{memberSearchQuery}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Statut Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        isTermine
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.statut}
                      </span>
                    </td>

                    {/* Confirmation Indicator */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-xs font-bold text-ht-emerald inline-flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-ht-emerald" />
                        <span>Confirmé</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ht-line bg-ht-page/90 flex justify-between items-center text-xs">
          <span className="text-ht-sage font-medium">
            💡 Cliquez sur l'icône de recherche (🔍) pour ouvrir la barre de recherche du membre responsable.
          </span>
          <button
            onClick={onClose}
            className="btn-anim px-6 py-2.5 gradient-emerald text-white rounded-2xl font-bold shadow-md"
          >
            Fermer & Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

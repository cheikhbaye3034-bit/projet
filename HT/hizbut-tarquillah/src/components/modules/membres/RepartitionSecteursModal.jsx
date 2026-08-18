import React, { useState } from 'react';
import { X, Briefcase, RefreshCw, CheckCircle2, Search, Users, ChevronRight, Layers } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const RepartitionSecteursModal = ({ isOpen, onClose }) => {
  const { membres, secteurs, updateMembreSecteur, bulkAssignSecteur, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSecteurFilter, setSelectedSecteurFilter] = useState('all');

  if (!isOpen) return null;

  const activeMembres = membres.filter(m => m.statut === 'Actif');

  const handleAutoDistribute = () => {
    if (activeMembres.length === 0 || secteurs.length === 0) return;
    
    activeMembres.forEach((m, index) => {
      const targetSecteur = secteurs[index % secteurs.length];
      updateMembreSecteur(m.id, targetSecteur.id);
    });

    showToast('⚡ Auto-répartition équitable effectuée avec succès sur tous les secteurs !');
  };

  // Filtered members
  const filteredMembres = membres.filter((m) => {
    const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
    const phone = m.telephone;
    const q = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(q) || phone.includes(q);
    const matchesSecteur = selectedSecteurFilter === 'all' || m.secteur_id === selectedSecteurFilter;
    return matchesSearch && matchesSecteur;
  });

  return (
    <div className="fixed inset-0 bg-ht-ink/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-ht-line flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-ht-line bg-gradient-to-r from-ht-mist via-white to-emerald-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl gradient-emerald text-white flex items-center justify-center font-bold shadow-md border border-ht-mint">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-ht-ink">
                Répartition des Membres par Secteurs de Travail
              </h3>
              <p className="text-xs text-ht-emerald font-semibold mt-0.5">
                Affectez chaque membre à une commission ou un secteur opérationnel de la Daara
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-ht-mist text-gray-500 font-bold flex items-center justify-center border border-ht-line transition-colors shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-5 border-b border-ht-line bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            {/* Filter by Sector */}
            <select
              value={selectedSecteurFilter}
              onChange={(e) => setSelectedSecteurFilter(e.target.value)}
              className="px-3.5 py-2 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink font-semibold focus:outline-none focus:border-ht-emerald"
            >
              <option value="all">Tous les Secteurs ({secteurs.length})</option>
              {secteurs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Distribute CTA */}
          <button
            onClick={handleAutoDistribute}
            className="btn-anim px-4 py-2.5 bg-ht-mist text-ht-emerald border border-ht-mint rounded-2xl text-xs font-extrabold hover:bg-ht-mint flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>✨ Répartir Équitablement</span>
          </button>
        </div>

        {/* Sectors Overview Cards Bar */}
        <div className="p-4 bg-ht-page/60 border-b border-ht-line overflow-x-auto flex items-center gap-3">
          {secteurs.map((s) => {
            const count = membres.filter(m => m.secteur_id === s.id).length;
            const isSelected = selectedSecteurFilter === s.id;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSecteurFilter(isSelected ? 'all' : s.id)}
                className={`px-3.5 py-2.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 flex-shrink-0 ${
                  isSelected
                    ? 'bg-ht-emerald text-white border-ht-emerald font-bold shadow-md'
                    : 'bg-white text-ht-ink border-ht-line hover:border-ht-mint'
                }`}
              >
                <Layers className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-ht-emerald'}`} />
                <div>
                  <div className="font-extrabold truncate max-w-[140px]">{s.nom.split('&')[0]}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-ht-sage'}`}>
                    {count} membre(s)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Allocation Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-ht-line text-[11px] font-extrabold text-ht-sage uppercase tracking-wider pb-3">
                <th className="py-3.5 px-4">Membre</th>
                <th className="py-3.5 px-4">Téléphone</th>
                <th className="py-3.5 px-4">Secteur / Commission de travail</th>
                <th className="py-3.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ht-line text-sm">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((m) => {
                  const currentSecteur = secteurs.find(s => s.id === m.secteur_id);

                  return (
                    <tr key={m.id} className="hover:bg-ht-mist/40 transition-colors">
                      {/* Membre column */}
                      <td className="py-3.5 px-4 font-bold text-ht-ink">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl gradient-emerald text-white font-extrabold text-xs flex items-center justify-center border border-ht-mint shadow-xs">
                            {m.prenom[0]}
                          </div>
                          <div>
                            <div className="font-extrabold">{m.prenom} {m.nom}</div>
                            <div className="text-[11px] font-normal text-ht-sage">{m.profession || 'Membre'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-xs font-mono font-semibold text-ht-ink">
                        {m.telephone}
                      </td>

                      {/* Sector Dropdown Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={m.secteur_id || ''}
                          onChange={(e) => updateMembreSecteur(m.id, e.target.value)}
                          className="w-full max-w-xs p-2.5 bg-ht-page hover:bg-ht-mist border border-ht-line hover:border-ht-mint rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald transition-colors"
                        >
                          <option value="">Non affecté</option>
                          {secteurs.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.nom} ({s.code})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status indicator */}
                      <td className="py-3.5 px-4 text-right">
                        {m.secteur_id ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Affecté</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-full border border-amber-200">
                            En attente
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-ht-sage text-sm italic">
                    Aucun membre à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ht-line bg-ht-page/90 flex justify-between items-center text-xs">
          <span className="text-ht-sage font-medium">
            💡 Les modifications de secteur s'enregistrent automatiquement.
          </span>
          <button
            onClick={onClose}
            className="btn-anim px-6 py-2.5 gradient-emerald text-white rounded-2xl font-bold shadow-md cursor-pointer"
          >
            Terminer & Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

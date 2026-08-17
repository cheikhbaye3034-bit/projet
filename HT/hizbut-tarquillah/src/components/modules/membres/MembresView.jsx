import React, { useState } from 'react';
import { Search, Plus, Filter, User, Phone, MapPin, ChevronRight, CheckCircle2, Clock, XCircle, Wallet, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MembreModal } from './MembreModal';
import { MembreDetailDrawer } from './MembreDetailDrawer';

export const MembresView = () => {
  const { membres, kourels, selectedMembreId, setSelectedMembreId, deleteMembre } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKourelFilter, setSelectedKourelFilter] = useState('all');
  const [selectedCotisationFilter, setSelectedCotisationFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [membreToDeleteId, setMembreToDeleteId] = useState('');
  const [deleteJustification, setDeleteJustification] = useState('');

  // Filtered members list logic
  const filteredMembres = membres.filter((m) => {
    const matchesSearch =
      m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.telephone.includes(searchQuery);

    const matchesKourel =
      selectedKourelFilter === 'all' || m.kourel_id === selectedKourelFilter;

    const matchesCotisation =
      selectedCotisationFilter === 'all' ||
      (selectedCotisationFilter === 'en_regle' && m.cotisation_statut === 'À jour') ||
      (selectedCotisationFilter === 'en_retard' && m.cotisation_statut !== 'À jour');

    return matchesSearch && matchesKourel && matchesCotisation;
  });

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    if (!membreToDeleteId) return;
    if (!deleteJustification.trim()) {
      alert('Veuillez fournir une justification de suppression.');
      return;
    }
    deleteMembre(membreToDeleteId);
    setIsDeleteModalOpen(false);
    setDeleteJustification('');
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in select-none">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-ht-line rounded-2xl text-sm text-ht-ink placeholder:text-ht-sage focus:outline-none focus:border-ht-fern focus:ring-1 focus:ring-ht-fern shadow-soft transition-all"
          />
        </div>

        {/* Action Buttons Pair: Ajouter & Supprimer (with justification) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 gradient-emerald text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 transform cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un membre</span>
          </button>

          <button
            onClick={() => {
              setMembreToDeleteId(membres.length > 0 ? membres[0].id : '');
              setDeleteJustification('');
              setIsDeleteModalOpen(true);
            }}
            className="px-4 py-2.5 bg-red-50 text-ht-clay border border-red-200 hover:bg-red-100 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 transform cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-ht-clay" />
            <span>Supprimer un membre</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-ht-inkSoft">
          <Filter className="w-4 h-4 text-ht-emerald" />
          <span>Filtres :</span>
        </div>

        {/* Kourel Filter */}
        <select
          value={selectedKourelFilter}
          onChange={(e) => setSelectedKourelFilter(e.target.value)}
          className="px-3.5 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink font-semibold focus:outline-none focus:border-ht-fern"
        >
          <option value="all">Tous les Kourels</option>
          {kourels.map((k) => (
            <option key={k.id} value={k.id}>
              {k.nom}
            </option>
          ))}
        </select>

        {/* Cotisation Filter */}
        <select
          value={selectedCotisationFilter}
          onChange={(e) => setSelectedCotisationFilter(e.target.value)}
          className="px-3.5 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink font-semibold focus:outline-none focus:border-ht-fern"
        >
          <option value="all">Toutes les Cotisations</option>
          <option value="en_regle">En règle (À jour)</option>
          <option value="en_retard">Non en règle (En retard)</option>
        </select>

        <span className="text-xs text-ht-sage font-medium ml-auto">
          <strong className="text-ht-ink">{filteredMembres.length}</strong> membre(s) inscrit(s)
        </span>
      </div>

      {/* Premium State-of-the-Art Members Table */}
      <div className="bg-white rounded-3xl border border-ht-line shadow-soft-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ht-page/90 border-b border-ht-line text-[11px] font-extrabold text-ht-sage uppercase tracking-wider">
                <th className="py-4 px-6">Prénom</th>
                <th className="py-4 px-6">Nom</th>
                <th className="py-4 px-6 whitespace-nowrap">Téléphone</th>
                <th className="py-4 px-6">Kourel</th>
                <th className="py-4 px-6">Cotisation</th>
                <th className="py-4 px-6">Statut</th>
                <th className="py-4 px-6 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ht-line text-sm text-ht-ink font-medium">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((membre) => {
                  const kourel = kourels.find((k) => k.id === membre.kourel_id);
                  const isEnRegle = membre.cotisation_statut === 'À jour';

                  return (
                    <tr
                      key={membre.id}
                      onClick={() => setSelectedMembreId(membre.id)}
                      className="hover:bg-ht-mist/60 transition-all duration-150 cursor-pointer group"
                    >
                      {/* Prénom Column with Initial Avatar Badge */}
                      <td className="py-4 px-6 font-semibold text-ht-ink">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl gradient-emerald text-white flex items-center justify-center font-display font-extrabold text-xs shadow-xs border border-ht-mint flex-shrink-0">
                            {membre.prenom[0]}
                          </div>
                          <span className="font-bold">{membre.prenom}</span>
                        </div>
                      </td>

                      {/* Nom Column in Uppercase Bold */}
                      <td className="py-4 px-6 font-extrabold text-ht-ink uppercase tracking-wide">
                        {membre.nom}
                      </td>

                      {/* Phone Column strictly on one single line (whitespace-nowrap) */}
                      <td className="py-4 px-6 text-xs text-ht-ink font-mono whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-ht-page rounded-lg border border-ht-line">
                          <Phone className="w-3.5 h-3.5 text-ht-sage flex-shrink-0" />
                          <span className="font-semibold">{membre.telephone}</span>
                        </div>
                      </td>

                      {/* Kourel Badge Column */}
                      <td className="py-4 px-6 text-xs">
                        <span className="px-3 py-1 bg-ht-mist text-ht-emerald font-bold rounded-xl border border-ht-mint inline-block whitespace-nowrap">
                          {kourel ? kourel.nom.split('—')[1] || kourel.nom : '-'}
                        </span>
                      </td>

                      {/* Cotisation Status Pill Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-3.5 py-1 text-xs font-extrabold rounded-full inline-flex items-center gap-1.5 ${
                            isEnRegle
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {isEnRegle ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>En règle</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-red-600" />
                              <span>En retard</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Statut Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${
                            membre.statut === 'Actif'
                              ? 'bg-ht-mist text-ht-emerald border border-ht-mint'
                              : membre.statut === 'Suspendu'
                              ? 'bg-red-50 text-ht-clay border border-red-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${membre.statut === 'Actif' ? 'bg-ht-emerald' : 'bg-ht-clay'}`}></span>
                          <span>{membre.statut}</span>
                        </span>
                      </td>

                      {/* Single Action: View Member Details */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMembreId(membre.id);
                          }}
                          className="px-3.5 py-1.5 bg-ht-mist text-ht-emerald hover:bg-ht-emerald hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-end gap-1.5 ml-auto shadow-xs active:scale-95 transform"
                        >
                          <span>Fiche</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ht-sage text-sm italic">
                    Aucun membre ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      <MembreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete Member Justification Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-ht-ink/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-5 border border-ht-line shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-ht-clay flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-ht-clay" />
                <span>Suppression d'un membre</span>
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 font-bold hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDelete} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                  Membre à supprimer
                </label>
                <select
                  value={membreToDeleteId}
                  onChange={(e) => setMembreToDeleteId(e.target.value)}
                  className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink"
                >
                  {membres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.prenom} {m.nom} ({m.telephone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-ht-clay uppercase tracking-wider block">
                  Justification / Motif de suppression <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Saisissez la justification obligatoire..."
                  value={deleteJustification}
                  onChange={(e) => setDeleteJustification(e.target.value)}
                  className="w-full p-3 bg-ht-page border border-red-200 rounded-xl text-xs text-ht-ink placeholder:text-gray-400 focus:outline-none focus:border-ht-clay focus:ring-1 focus:ring-ht-clay"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-red-700 active:scale-95 transform transition-all"
                >
                  Confirmer la suppression
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Detail Drawer */}
      <MembreDetailDrawer
        membreId={selectedMembreId}
        onClose={() => setSelectedMembreId(null)}
      />
    </div>
  );
};

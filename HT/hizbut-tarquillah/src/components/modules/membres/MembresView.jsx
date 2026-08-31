import React, { useState } from 'react';
import { Search, Plus, Filter, User, Phone, MapPin, ChevronRight, CheckCircle2, Clock, XCircle, Wallet, Trash2, ArrowRight, LayoutGrid, Briefcase, Download, Sparkles, Users, Check } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MembreModal } from './MembreModal';
import { MembreDetailDrawer } from './MembreDetailDrawer';
import { RepartitionSecteursModal } from './RepartitionSecteursModal';
import { EnregistrerCotisationModal } from './EnregistrerCotisationModal';

export const MembresView = () => {
  const { membres, zones, kourels, selectedMembreId, setSelectedMembreId, deleteMembre, toggleMembreCotisation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKourelFilter, setSelectedKourelFilter] = useState('all');
  const [selectedCotisationFilter, setSelectedCotisationFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRepartitionModalOpen, setIsRepartitionModalOpen] = useState(false);
  const [isCotisationModalOpen, setIsCotisationModalOpen] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [membreToDeleteId, setMembreToDeleteId] = useState('');
  const [deleteJustification, setDeleteJustification] = useState('');

  // Filtered members list logic
  const filteredMembres = (membres || []).filter((m) => {
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

  // If a member is selected, display their full profile sheet directly in-page
  if (selectedMembreId) {
    return (
      <div className="pb-12 animate-fade-in">
        <MembreDetailDrawer
          membreId={selectedMembreId}
          onClose={() => setSelectedMembreId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4 animate-fade-in select-none">

      {/* ── TOP ACTION BAR ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par prénom, nom, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Enregistrer Cotisations Button */}
          <button
            onClick={() => setIsCotisationModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 hover:from-emerald-800 hover:to-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all flex-shrink-0 cursor-pointer border border-emerald-700/50"
            title="Enregistrer la situation financière des membres"
          >
            <Wallet className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>Enregistrer membres en règle</span>
          </button>

          {/* Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>

      {/* ── FILTER CHIPS (horizontal scroll) ──────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {/* Kourel Chips */}
        <button
          onClick={() => setSelectedKourelFilter('all')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            selectedKourelFilter === 'all'
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
          }`}
        >
          Tous les Kourels
        </button>
        {kourels.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKourelFilter(k.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedKourelFilter === k.id
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
            }`}
          >
            {k.nom.split('—')[1]?.trim() || k.nom}
          </button>
        ))}

        {/* Cotisation Chips */}
        <div className="w-px h-4 bg-slate-200 mx-1 flex-shrink-0" />
        {[
          { id: 'all',      label: 'Toutes cotisations' },
          { id: 'en_regle', label: '✓ À jour' },
          { id: 'en_retard',label: '✗ En retard' }
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelectedCotisationFilter(opt.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedCotisationFilter === opt.id
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-slate-500 font-semibold">
          <strong className="text-slate-900 font-black">{filteredMembres.length}</strong> membre(s)
        </span>
        <button
          onClick={() => setIsRepartitionModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 active:scale-95 transition-all"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Secteurs</span>
        </button>
      </div>

      {/* ── MOBILE: CARD LIST (hidden on md+) ─────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {filteredMembres.length > 0 ? (
          filteredMembres.map((membre) => {
            const kourel = kourels.find((k) => k.id === membre.kourel_id);
            const isEnRegle = membre.cotisation_statut === 'À jour';
            return (
              <button
                key={membre.id}
                onClick={() => setSelectedMembreId(membre.id)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left hover:border-emerald-300 hover:shadow-md active:scale-[0.98] transition-all"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-sm">
                  {membre.prenom[0]}{membre.nom[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-black text-sm text-slate-900 truncate">
                      {membre.prenom} {membre.nom}
                    </span>
                    <span className={`flex-shrink-0 w-2 h-2 rounded-full ${membre.statut === 'Actif' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{membre.telephone}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg">
                      {kourel ? (kourel.nom.split('—')[1]?.trim() || kourel.nom) : 'N/A'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMembreCotisation(membre.id);
                      }}
                      className={`px-2.5 py-0.5 font-bold text-[10px] rounded-lg inline-flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                        isEnRegle
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                      title="Cliquer pour basculer : En règle / En retard"
                    >
                      {isEnRegle ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                      {isEnRegle ? 'En règle' : 'En retard'}
                    </button>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </button>
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-semibold">Aucun membre trouvé</p>
            <p className="text-xs mt-1">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>

      {/* ── DESKTOP: TABLE (hidden on mobile) ─────────────────────────────── */}
      <div className="hidden md:block pro-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Prénom</th>
                <th className="py-3.5 px-6">Nom</th>
                <th className="py-3.5 px-6 whitespace-nowrap">Téléphone</th>
                <th className="py-3.5 px-6">Kourel</th>
                <th className="py-3.5 px-6">Cotisation</th>
                <th className="py-3.5 px-6">Statut</th>
                <th className="py-3.5 px-6 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-medium">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((membre) => {
                  const kourel = kourels.find((k) => k.id === membre.kourel_id);
                  const isEnRegle = membre.cotisation_statut === 'À jour';
                  return (
                    <tr
                      key={membre.id}
                      onClick={() => setSelectedMembreId(membre.id)}
                      className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs border border-slate-200 flex-shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                            {membre.prenom[0]}
                          </div>
                          <span className="font-bold">{membre.prenom}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-black text-slate-900 uppercase tracking-wide">{membre.nom}</td>
                      <td className="py-3.5 px-6 font-mono whitespace-nowrap text-slate-600">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-200">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="font-semibold">{membre.telephone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200 inline-block whitespace-nowrap">
                          {kourel ? kourel.nom.split('—')[1] || kourel.nom : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMembreCotisation(membre.id);
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                            isEnRegle 
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                          title="Cliquer pour basculer la cotisation : En règle / En retard"
                        >
                          {isEnRegle ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-rose-600" />}
                          <span>{isEnRegle ? 'En règle' : 'En retard'}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full inline-flex items-center gap-1.5 ${membre.statut === 'Actif' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${membre.statut === 'Actif' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {membre.statut}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedMembreId(membre.id); }}
                          className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-emerald-800 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-end gap-1 ml-auto active:scale-95"
                        >
                          <span>Détail</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs italic">
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
        <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-[500] animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md space-y-4 border-t sm:border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Suppression d'un membre</span>
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-slate-400 font-bold hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDelete} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Membre à supprimer
                </label>
                <select
                  value={membreToDeleteId}
                  onChange={(e) => setMembreToDeleteId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  {membres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.prenom} {m.nom} ({m.telephone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                  Justification obligatoire <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Motif de la suppression..."
                  value={deleteJustification}
                  onChange={(e) => setDeleteJustification(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-rose-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-rose-700 active:scale-95 transition-all"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repartition Secteurs Modal */}
      <RepartitionSecteursModal
        isOpen={isRepartitionModalOpen}
        onClose={() => setIsRepartitionModalOpen(false)}
      />

      {/* Enregistrer Cotisations Modal */}
      <EnregistrerCotisationModal
        isOpen={isCotisationModalOpen}
        onClose={() => setIsCotisationModalOpen(false)}
      />
    </div>
  );
};


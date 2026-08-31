import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Search, 
  Users, 
  ShieldCheck, 
  Save, 
  AlertTriangle,
  Check,
  Filter
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const EnregistrerCotisationModal = ({ isOpen, onClose }) => {
  const { membres, kourels, bulkUpdateCotisations } = useApp();

  // State of checked member IDs who are "En règle"
  const [selectedEnRegleIds, setSelectedEnRegleIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKourelFilter, setSelectedKourelFilter] = useState('all');

  // Initialize selected IDs from current members state when modal opens
  useEffect(() => {
    if (isOpen && membres) {
      const initialEnRegle = membres
        .filter(m => m.cotisation_statut === 'À jour')
        .map(m => m.id);
      setSelectedEnRegleIds(initialEnRegle);
    }
  }, [isOpen, membres]);

  if (!isOpen) return null;

  const filteredMembres = (membres || []).filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || (
      m.nom.toLowerCase().includes(q) ||
      m.prenom.toLowerCase().includes(q) ||
      m.telephone.includes(q)
    );
    const matchKourel = selectedKourelFilter === 'all' || m.kourel_id === selectedKourelFilter;
    return matchQuery && matchKourel;
  });

  const toggleMember = (id) => {
    setSelectedEnRegleIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredMembres.map(m => m.id);
    setSelectedEnRegleIds(prev => Array.from(new Set([...prev, ...filteredIds])));
  };

  const handleDeselectAllFiltered = () => {
    const filteredIdSet = new Set(filteredMembres.map(m => m.id));
    setSelectedEnRegleIds(prev => prev.filter(id => !filteredIdSet.has(id)));
  };

  const handleSave = () => {
    bulkUpdateCotisations(selectedEnRegleIds);
    onClose();
  };

  const enRegleCount = selectedEnRegleIds.length;
  const enRetardCount = (membres?.length || 0) - enRegleCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-scale-up">

        {/* ── Header Banner (Dark Emerald Hero) ── */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600/50 flex items-center justify-center shadow-inner flex-shrink-0">
              <Wallet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                Gestion des Cotisations
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-white mt-0.5">
                Enregistrer les Membres en Règle
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Summary & Rule Notice ── */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-slate-700 font-medium leading-snug">
              Les membres cochés seront <strong className="text-emerald-800 font-bold">En règle (À jour)</strong>. Tous les autres seront automatiquement marqués <strong className="text-rose-700 font-bold">En retard</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200">
              ✓ {enRegleCount} En règle
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-black text-xs border border-rose-200">
              ✗ {enRetardCount} En retard
            </span>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un membre par nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedKourelFilter}
              onChange={(e) => setSelectedKourelFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Tous les Kourels</option>
              {kourels.map(k => (
                <option key={k.id} value={k.id}>{k.nom.split('—')[1]?.trim() || k.nom}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-all cursor-pointer whitespace-nowrap"
            >
              Tout cocher
            </button>
            <button
              type="button"
              onClick={handleDeselectAllFiltered}
              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
            >
              Décocher
            </button>
          </div>
        </div>

        {/* ── Members List with Checkboxes ── */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 max-h-[45vh]">
          {filteredMembres.length > 0 ? (
            filteredMembres.map((m) => {
              const isChecked = selectedEnRegleIds.includes(m.id);
              const kourel = kourels.find(k => k.id === m.kourel_id);

              return (
                <div
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'border-2 border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                      {m.prenom[0]}{m.nom[0]}
                    </div>

                    <div className="min-w-0">
                      <p className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {m.telephone} • {kourel ? (kourel.nom.split('—')[1]?.trim() || kourel.nom) : 'Kourel'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase flex items-center gap-1 flex-shrink-0 ${
                    isChecked
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isChecked ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {isChecked ? 'En règle' : 'En retard'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs italic">
              Aucun membre trouvé correspondant à la recherche.
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-200" />
            <span>Valider et Enregistrer la Situation</span>
          </button>
        </div>

      </div>
    </div>
  );
};

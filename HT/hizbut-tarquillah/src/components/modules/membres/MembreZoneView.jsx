import React, { useState } from 'react';
import {
  MapPin,
  Users,
  ShieldCheck,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  UserX,
  Edit3,
  Trash2,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const MembreZoneView = () => {
  const {
    zones,
    membres,
    kourels,
    updateMembreZone,
    bulkUpdateMembreZone,
    updateZoneResponsable,
    addZone,
    deleteZone,
    setSelectedMembreId
  } = useApp();

  // Search & Filter State inside Zone View
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');

  // Bulk Dispatch State for Supervisor
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [targetZoneId, setTargetZoneId] = useState(zones[0]?.id || '');

  // Modals state
  const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
  const [isEditRespModalOpen, setIsEditRespModalOpen] = useState(false);
  const [activeZoneForRespEdit, setActiveZoneForRespEdit] = useState(null);
  const [newResponsableName, setNewResponsableName] = useState('');

  // Single member reassign modal state
  const [reassignMembreId, setReassignMembreId] = useState(null);
  const [reassignTargetZoneId, setReassignTargetZoneId] = useState('');

  // Form state for new Zone creation
  const [newZoneData, setNewZoneData] = useState({
    nom: '',
    code: '',
    description: '',
    responsable: '',
    couleur: 'emerald'
  });

  // Calculate statistics
  const totalMembres = membres.length;
  const membresAffectes = membres.filter((m) => m.zone_id && zones.some((z) => z.id === m.zone_id));
  const membresNonAffectes = membres.filter((m) => !m.zone_id || !zones.some((z) => z.id === m.zone_id));
  const tauxRepartition = totalMembres > 0 ? Math.round((membresAffectes.length / totalMembres) * 100) : 0;

  // Filtered zones list
  const filteredZones = zones.filter((z) => {
    if (selectedZoneFilter === 'all') return true;
    return z.id === selectedZoneFilter;
  });

  // Color helper mapping for zone card themes
  const getZoneTheme = (couleur) => {
    switch (couleur) {
      case 'indigo':
        return {
          bg: 'bg-indigo-50/70',
          border: 'border-indigo-200',
          badge: 'bg-indigo-600 text-white',
          accentText: 'text-indigo-700',
          gradient: 'from-indigo-600 to-blue-600',
          lightBg: 'bg-indigo-50'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50/70',
          border: 'border-amber-200',
          badge: 'bg-amber-600 text-white',
          accentText: 'text-amber-800',
          gradient: 'from-amber-500 to-orange-600',
          lightBg: 'bg-amber-50'
        };
      case 'sky':
        return {
          bg: 'bg-sky-50/70',
          border: 'border-sky-200',
          badge: 'bg-sky-600 text-white',
          accentText: 'text-sky-800',
          gradient: 'from-sky-500 to-cyan-600',
          lightBg: 'bg-sky-50'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50/70',
          border: 'border-rose-200',
          badge: 'bg-rose-600 text-white',
          accentText: 'text-rose-800',
          gradient: 'from-rose-500 to-pink-600',
          lightBg: 'bg-rose-50'
        };
      default: // emerald
        return {
          bg: 'bg-emerald-50/70',
          border: 'border-emerald-200',
          badge: 'bg-ht-emerald text-white',
          accentText: 'text-ht-emerald',
          gradient: 'gradient-emerald',
          lightBg: 'bg-ht-mist'
        };
    }
  };

  // Checkbox toggle for bulk selection
  const toggleMemberSelection = (id) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((item) => item !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSelectAllVisible = () => {
    if (selectedMemberIds.length === membres.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(membres.map((m) => m.id));
    }
  };

  // Submit bulk assignment
  const handleBulkReassignSubmit = (e) => {
    e.preventDefault();
    if (selectedMemberIds.length === 0) return;
    if (!targetZoneId) return;
    bulkUpdateMembreZone(selectedMemberIds, targetZoneId);
    setSelectedMemberIds([]);
  };

  // Submit single member zone update
  const handleSingleReassignSubmit = (e) => {
    e.preventDefault();
    if (!reassignMembreId || !reassignTargetZoneId) return;
    updateMembreZone(reassignMembreId, reassignTargetZoneId);
    setReassignMembreId(null);
  };

  // Submit new zone creation
  const handleAddZoneSubmit = (e) => {
    e.preventDefault();
    if (!newZoneData.nom.trim()) return;
    addZone(newZoneData);
    setIsAddZoneModalOpen(false);
    setNewZoneData({ nom: '', code: '', description: '', responsable: '', couleur: 'emerald' });
  };

  // Submit supervisor edit
  const handleEditRespSubmit = (e) => {
    e.preventDefault();
    if (!activeZoneForRespEdit || !newResponsableName.trim()) return;
    updateZoneResponsable(activeZoneForRespEdit.id, newResponsableName);
    setIsEditRespModalOpen(false);
    setActiveZoneForRespEdit(null);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in select-none">
      {/* Top KPI Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Zones Totales */}
        <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl gradient-emerald text-white flex items-center justify-center shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-extrabold text-ht-ink">{zones.length}</div>
            <div className="text-xs font-bold text-ht-sage uppercase tracking-wider">Zones Géographiques</div>
          </div>
        </div>

        {/* KPI 2: Membres Affectés */}
        <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-extrabold text-emerald-700">{membresAffectes.length}</div>
            <div className="text-xs font-bold text-ht-sage uppercase tracking-wider">Membres Affectés</div>
          </div>
        </div>

        {/* KPI 3: Membres Non Affectés */}
        <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${membresNonAffectes.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'} flex items-center justify-center shadow-xs`}>
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-2xl font-display font-extrabold ${membresNonAffectes.length > 0 ? 'text-amber-700' : 'text-ht-ink'}`}>
              {membresNonAffectes.length}
            </div>
            <div className="text-xs font-bold text-ht-sage uppercase tracking-wider">Non Affectés</div>
          </div>
        </div>

        {/* KPI 4: Taux de couverture */}
        <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-display font-extrabold text-indigo-700">{tauxRepartition}%</div>
            <div className="text-xs font-bold text-ht-sage uppercase tracking-wider">Taux de Couverture</div>
          </div>
        </div>
      </div>

      {/* SUPERVISOR DISPATCHING HUB (ESPACE SUPERVISEUR) */}
      <div className="bg-gradient-to-br from-ht-ink to-emerald-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ht-emerald/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/50 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-extrabold text-emerald-300 tracking-wider uppercase mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Espace Superviseur — Dispatching & Affectation</span>
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                Répartition dynamique des membres par zones
              </h2>
              <p className="text-xs text-emerald-200/80 mt-1 max-w-2xl">
                Affectez individuellement ou en masse les membres aux zones géographiques sous la supervision des responsables désignés.
              </p>
            </div>

            <button
              onClick={() => setIsAddZoneModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-ht-ink font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer active:scale-95 transform"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Créer une nouvelle Zone</span>
            </button>
          </div>

          {/* Bulk Dispatching Bar */}
          <form onSubmit={handleBulkReassignSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="selectAllCheck"
                checked={selectedMemberIds.length > 0 && selectedMemberIds.length === membres.length}
                onChange={handleSelectAllVisible}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <label htmlFor="selectAllCheck" className="text-xs font-bold text-white cursor-pointer select-none">
                {selectedMemberIds.length > 0
                  ? `${selectedMemberIds.length} membre(s) sélectionné(s)`
                  : 'Sélectionner tous les membres'}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
              <span className="text-xs text-emerald-200 font-semibold whitespace-nowrap hidden sm:inline">
                Réaffecter à :
              </span>
              <select
                value={targetZoneId}
                onChange={(e) => setTargetZoneId(e.target.value)}
                className="px-3.5 py-2 bg-ht-ink/90 border border-emerald-500/30 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-emerald-400 flex-1"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id} className="bg-ht-ink text-white">
                    {z.nom} ({z.code}) — {z.responsable}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={selectedMemberIds.length === 0}
                className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedMemberIds.length > 0
                    ? 'bg-emerald-400 text-ht-ink hover:bg-emerald-300 cursor-pointer active:scale-95'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Affecter ({selectedMemberIds.length})</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Warning banner for Unassigned Members if any */}
      {membresNonAffectes.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {membresNonAffectes.length} membre(s) sans zone attribuée
              </h4>
              <p className="text-[11px] text-amber-700 font-medium">
                Certains membres inscrits ne sont rattachés à aucune zone géographique.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedMemberIds(membresNonAffectes.map((m) => m.id));
            }}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            Sélectionner pour dispatch
          </button>
        </div>
      )}

      {/* Zone Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-ht-emerald" />
          <span className="text-xs font-bold text-ht-ink">Filtrer par Zone :</span>
          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className="px-3 py-1.5 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-fern"
          >
            <option value="all">Toutes les Zones ({zones.length})</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-ht-sage absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Chercher un membre dans les zones..."
            value={searchMemberQuery}
            onChange={(e) => setSearchMemberQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink placeholder:text-ht-sage focus:outline-none focus:border-ht-fern"
          />
        </div>
      </div>

      {/* GRID OF ZONE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredZones.map((zone) => {
          const theme = getZoneTheme(zone.couleur);
          // Members assigned to this zone
          const zoneMembers = membres.filter((m) => m.zone_id === zone.id);
          // Apply search filter if active
          const displayedMembers = zoneMembers.filter((m) => {
            if (!searchMemberQuery) return true;
            const q = searchMemberQuery.toLowerCase();
            return m.nom.toLowerCase().includes(q) || m.prenom.toLowerCase().includes(q) || m.telephone.includes(q);
          });

          const zonePct = totalMembres > 0 ? Math.round((zoneMembers.length / totalMembres) * 100) : 0;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-3xl border ${theme.border} shadow-soft-lg overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl`}
            >
              {/* Card Top Banner Header */}
              <div>
                <div className={`p-5 ${theme.bg} border-b ${theme.border} space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${theme.badge} tracking-wider`}>
                        {zone.code}
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-ht-ink mt-1.5">
                        {zone.nom}
                      </h3>
                      <p className="text-xs text-ht-inkSoft font-medium line-clamp-2 mt-0.5">
                        {zone.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveZoneForRespEdit(zone);
                        setNewResponsableName(zone.responsable);
                        setIsEditRespModalOpen(true);
                      }}
                      className="p-2 bg-white rounded-xl border border-ht-line text-ht-sage hover:text-ht-emerald hover:border-ht-mint transition-all shadow-xs flex-shrink-0"
                      title="Changer le superviseur"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Responsable & Member count bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-ht-ink">
                      <ShieldCheck className={`w-4 h-4 ${theme.accentText}`} />
                      <span className="text-ht-sage font-medium">Superviseur :</span>
                      <span className="font-bold">{zone.responsable}</span>
                    </div>

                    <div className="font-bold text-ht-ink bg-white px-3 py-1 rounded-xl border border-ht-line shadow-xs">
                      {zoneMembers.length} membre(s) ({zonePct}%)
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${theme.badge}`}
                      style={{ width: `${Math.min(zonePct, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* List of members in this zone */}
                <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
                  {displayedMembers.length > 0 ? (
                    displayedMembers.map((m) => {
                      const k = kourels.find((k) => k.id === m.kourel_id);
                      const isSelected = selectedMemberIds.includes(m.id);

                      return (
                        <div
                          key={m.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                              : 'bg-ht-page/70 hover:bg-ht-mist/80 border-ht-line'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleMemberSelection(m.id)}
                              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer flex-shrink-0"
                            />

                            <div
                              onClick={() => setSelectedMembreId(m.id)}
                              className="w-8 h-8 rounded-xl gradient-emerald text-white flex items-center justify-center font-bold text-xs flex-shrink-0 cursor-pointer shadow-xs"
                            >
                              {m.prenom[0]}
                            </div>

                            <div
                              onClick={() => setSelectedMembreId(m.id)}
                              className="min-w-0 cursor-pointer"
                            >
                              <div className="font-bold text-xs text-ht-ink truncate">
                                {m.prenom} {m.nom}
                              </div>
                              <div className="text-[10px] text-ht-sage font-medium truncate">
                                {k ? k.nom.split('—')[1] || k.nom : 'Sans kourel'} • {m.telephone}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setReassignMembreId(m.id);
                              setReassignTargetZoneId(zone.id);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-ht-emerald hover:text-white border border-ht-line rounded-lg text-[11px] font-semibold text-ht-inkSoft transition-all flex-shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Déplacer</span>
                            <ArrowRightLeft className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-ht-sage italic">
                      Aucun membre trouvé dans cette zone.
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-ht-page border-t border-ht-line flex items-center justify-between text-xs">
                <span className="text-[11px] text-ht-sage font-semibold">
                  Zone active dans le système
                </span>
                {zoneMembers.length === 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Voulez-vous supprimer la zone "${zone.nom}" ?`)) {
                        deleteZone(zone.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SINGLE MEMBER REASSIGNMENT MODAL */}
      {reassignMembreId && (
        <div className="fixed inset-0 bg-ht-ink/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 border border-ht-line shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-ht-ink flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-ht-emerald" />
                <span>Réaffectation de Zone</span>
              </h3>
              <button
                onClick={() => setReassignMembreId(null)}
                className="text-gray-400 font-bold hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSingleReassignSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block mb-1">
                  Sélectionner la nouvelle Zone
                </label>
                <select
                  value={reassignTargetZoneId}
                  onChange={(e) => setReassignTargetZoneId(e.target.value)}
                  className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-fern"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nom} ({z.code}) — Sup. {z.responsable}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignMembreId(null)}
                  className="px-4 py-2 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Confirmer le transfert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SUPERVISOR MODAL */}
      {isEditRespModalOpen && activeZoneForRespEdit && (
        <div className="fixed inset-0 bg-ht-ink/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 border border-ht-line shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-ht-ink flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-ht-emerald" />
                <span>Superviseur de la zone : {activeZoneForRespEdit.nom}</span>
              </h3>
              <button
                onClick={() => setIsEditRespModalOpen(false)}
                className="text-gray-400 font-bold hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditRespSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block mb-1">
                  Nom du responsable superviseur *
                </label>
                <input
                  type="text"
                  required
                  value={newResponsableName}
                  onChange={(e) => setNewResponsableName(e.target.value)}
                  placeholder="ex: Serigne Modou Kara"
                  className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-fern"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditRespModalOpen(false)}
                  className="px-4 py-2 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ZONE MODAL */}
      {isAddZoneModalOpen && (
        <div className="fixed inset-0 bg-ht-ink/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-4 border border-ht-line shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ht-ink">Créer une nouvelle Zone</h3>
                <p className="text-xs text-ht-inkSoft">Ajouter une découpe géographique organisationnelle</p>
              </div>
              <button
                onClick={() => setIsAddZoneModalOpen(false)}
                className="text-gray-400 font-bold hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddZoneSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ht-ink uppercase tracking-wider block mb-1">
                  Nom de la zone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Zone Diaspora / Europe"
                  value={newZoneData.nom}
                  onChange={(e) => setNewZoneData({ ...newZoneData, nom: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-fern"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ht-ink uppercase tracking-wider block mb-1">
                    Code Zone
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Z-EUROPE-06"
                    value={newZoneData.code}
                    onChange={(e) => setNewZoneData({ ...newZoneData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-fern"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ht-ink uppercase tracking-wider block mb-1">
                    Couleur du badge
                  </label>
                  <select
                    value={newZoneData.couleur}
                    onChange={(e) => setNewZoneData({ ...newZoneData, couleur: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-fern font-semibold"
                  >
                    <option value="emerald">Émeraude / Vert</option>
                    <option value="indigo">Indigo / Bleu</option>
                    <option value="amber">Ambre / Or</option>
                    <option value="sky">Ciel / Cyan</option>
                    <option value="rose">Rose / Rubis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ht-ink uppercase tracking-wider block mb-1">
                  Superviseur responsable
                </label>
                <input
                  type="text"
                  placeholder="ex: Serigne Cheikh Mbacké"
                  value={newZoneData.responsable}
                  onChange={(e) => setNewZoneData({ ...newZoneData, responsable: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-fern"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ht-ink uppercase tracking-wider block mb-1">
                  Description / Quartiers couverts
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Paris, Lyon, Marseille, Bruxelles..."
                  value={newZoneData.description}
                  onChange={(e) => setNewZoneData({ ...newZoneData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-fern"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-ht-line">
                <button
                  type="button"
                  onClick={() => setIsAddZoneModalOpen(false)}
                  className="px-4 py-2.5 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Créer la Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

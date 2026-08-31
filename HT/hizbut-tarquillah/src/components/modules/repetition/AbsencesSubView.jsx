import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Hourglass, 
  Search, 
  Calendar, 
  User, 
  Filter, 
  Check, 
  X,
  FileText,
  Clock
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AbsencesSubView = () => {
  const { absenceRequests, updateAbsenceRequest, kourels, showToast } = useApp();
  const [filterStatut, setFilterStatut] = useState('all'); // 'all' | 'En attente' | 'Acceptée' | 'Refusée'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKourel, setSelectedKourel] = useState('all');

  const filteredRequests = (absenceRequests || []).filter(r => {
    if (filterStatut !== 'all' && r.statut !== filterStatut) return false;
    if (selectedKourel !== 'all' && r.kourel_id !== selectedKourel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNom = r.membre_nom?.toLowerCase().includes(q);
      const matchMotif = r.motif_label?.toLowerCase().includes(q) || r.motif?.toLowerCase().includes(q);
      const matchJustif = r.justification?.toLowerCase().includes(q);
      if (!matchNom && !matchMotif && !matchJustif) return false;
    }
    return true;
  });

  const handleAccept = (id, nom) => {
    updateAbsenceRequest(id, { statut: 'Acceptée' });
    showToast(`✅ Absence de ${nom} acceptée et justifiée.`);
  };

  const handleRefuse = (id, nom) => {
    updateAbsenceRequest(id, { statut: 'Refusée' });
    showToast(`❌ Demande d'absence de ${nom} refusée.`, 'info');
  };

  const pendingCount = (absenceRequests || []).filter(r => r.statut === 'En attente').length;

  return (
    <div className="space-y-4 animate-fade-in select-none">
      
      {/* ── Toolbar / Filters ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par membre, motif ou justification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          {/* Filter Kourel & Statut */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedKourel}
              onChange={(e) => setSelectedKourel(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Tous les Kourels</option>
              {kourels.map(k => (
                <option key={k.id} value={k.id}>{k.nom}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'En attente', label: `En attente (${pendingCount})` },
                { id: 'Acceptée', label: 'Acceptées' },
                { id: 'Refusée', label: 'Refusées' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatut(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatut === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Requests List ── */}
      <div className="space-y-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => {
            const isPending = req.statut === 'En attente';
            const isAccepted = req.statut === 'Acceptée';
            const kourelName = kourels.find(k => k.id === req.kourel_id)?.nom || 'Kourel';

            return (
              <div
                key={req.id}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all bg-white shadow-xs ${
                  isPending ? 'border-amber-300 ring-2 ring-amber-500/10' :
                  isAccepted ? 'border-slate-200 hover:border-emerald-300' :
                  'border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
                      isPending ? 'bg-amber-100 text-amber-800' :
                      isAccepted ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {isPending ? <Hourglass className="w-5 h-5" /> :
                       isAccepted ? <CheckCircle2 className="w-5 h-5" /> :
                       <XCircle className="w-5 h-5" />}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-black text-sm text-slate-900">
                          {req.membre_nom}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {kourelName}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          isPending ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          isAccepted ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {req.statut}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
                        <span>Motif : {req.motif_label || req.motif}</span>
                        <span>•</span>
                        <span className="text-slate-500">Séance du : <strong>{req.seance_date}</strong></span>
                        <span>•</span>
                        <span className="text-slate-400 text-[11px]">Demandé le {req.date_soumission}</span>
                      </div>

                      {req.justification && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic leading-relaxed mt-2">
                          « {req.justification} »
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions (Accept / Refuse) */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleAccept(req.id, req.membre_nom)}
                          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accepter</span>
                        </button>
                        <button
                          onClick={() => handleRefuse(req.id, req.membre_nom)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Refuser</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {isAccepted ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Validée
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Rejetée
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-xs italic">
            Aucune demande d'absence correspondant aux critères.
          </div>
        )}
      </div>

    </div>
  );
};

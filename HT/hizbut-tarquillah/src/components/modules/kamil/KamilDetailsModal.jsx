import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle2, BookOpen, Search, Clock, Calendar, ShieldCheck, ChevronRight, History, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const KamilDetailsModal = ({ isOpen, onClose, initialTab = 'termines' }) => {
  const { kamilCycle, membres, kourels, pastKamilCycles } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab); // 'termines' | 'encours' | 'membres' | 'cycles'
  const [searchQuery, setSearchQuery] = useState('');

  // Sync activeTab when initialTab or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Filter assignations
  const assignations = kamilCycle.assignations || [];
  const terminesList = assignations.filter((a) => a.statut === 'Terminé');
  const restantsList = assignations.filter((a) => a.statut !== 'Terminé');

  // Group assignations by member
  const memberAssignmentsMap = {};
  assignations.forEach((a) => {
    if (!memberAssignmentsMap[a.membre_id]) {
      memberAssignmentsMap[a.membre_id] = [];
    }
    memberAssignmentsMap[a.membre_id].push(a);
  });

  const involvedMemberIds = Object.keys(memberAssignmentsMap);
  const involvedMembers = membres.filter((m) => involvedMemberIds.includes(m.id));

  // Filtered members list
  const filteredMembers = involvedMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
    const phone = m.telephone || '';
    const assignedJukis = (memberAssignmentsMap[m.id] || []).map((a) => `juki ${a.juz}`).join(' ');
    return fullName.includes(q) || phone.includes(q) || assignedJukis.includes(q);
  });

  // Filtered completed list
  const filteredTermines = terminesList.filter((a) => {
    const q = searchQuery.toLowerCase();
    const m = membres.find((mem) => mem.id === a.membre_id);
    const memberName = m ? `${m.prenom} ${m.nom}`.toLowerCase() : '';
    return (
      `juki ${a.juz}`.includes(q) ||
      `${a.juz}`.includes(q) ||
      memberName.includes(q) ||
      (a.nom_juz && a.nom_juz.toLowerCase().includes(q))
    );
  });

  // Filtered in-progress / to-do list
  const filteredRestants = restantsList.filter((a) => {
    const q = searchQuery.toLowerCase();
    const m = membres.find((mem) => mem.id === a.membre_id);
    const memberName = m ? `${m.prenom} ${m.nom}`.toLowerCase() : '';
    return (
      `juki ${a.juz}`.includes(q) ||
      `${a.juz}`.includes(q) ||
      memberName.includes(q) ||
      (a.nom_juz && a.nom_juz.toLowerCase().includes(q))
    );
  });

  // Filtered past cycles
  const filteredPastCycles = (pastKamilCycles || []).filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      `cycle ${c.numero_cycle}`.includes(q) ||
      (c.date_debut && c.date_debut.includes(q)) ||
      (c.date_fin_prevue && c.date_fin_prevue.includes(q))
    );
  });

  return (
    <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[500] animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="p-6 border-b border-ht-line bg-gradient-to-r from-ht-mist via-white to-emerald-50/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl gradient-emerald text-white flex items-center justify-center font-bold shadow-md border border-ht-mint">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ht-mint text-ht-emerald text-[11px] font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kamil #{kamilCycle.numero_cycle} — Suivi des Portions</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-ht-ink mt-0.5">
                {activeTab === 'termines' && 'Détail des Parties Terminées'}
                {activeTab === 'encours' && 'Détail des Parties Restantes'}
                {activeTab === 'membres' && 'Détail des Membres Impliqués'}
                {activeTab === 'cycles' && 'Historique des Cycles Kamil'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-ht-mist text-gray-500 font-bold flex items-center justify-center border border-ht-line transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs & Search */}
        <div className="p-4 border-b border-ht-line bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('termines')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'termines'
                  ? 'gradient-emerald text-white shadow-md'
                  : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist hover:text-ht-ink border border-ht-line'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Parties Terminées ({terminesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('encours')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'encours'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist hover:text-ht-ink border border-ht-line'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Restantes ({restantsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('membres')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'membres'
                  ? 'gradient-emerald text-white shadow-md'
                  : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist hover:text-ht-ink border border-ht-line'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Membres ({involvedMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cycles')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cycles'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist hover:text-ht-ink border border-ht-line'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Historique Cycles</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-ht-sage absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou Juki..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: Parties Terminées Uniquement */}
          {activeTab === 'termines' && (
            <div className="space-y-3">
              {filteredTermines.length > 0 ? (
                filteredTermines.map((item) => {
                  const m = membres.find((mem) => mem.id === item.membre_id);
                  const kourel = m ? kourels.find((k) => k.id === m.kourel_id) : null;

                  return (
                    <div
                      key={item.juz}
                      className="p-4 bg-white rounded-2xl border border-ht-line flex items-center justify-between gap-4 shadow-xs hover:border-ht-mint transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                          {item.juz}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-ht-ink">
                            Juki {item.juz} — <span className="text-ht-emerald">{item.nom_juz || `Portion ${item.juz}`}</span>
                          </div>
                          <div className="text-xs text-ht-sage mt-0.5">
                            Récité par <strong className="text-ht-ink">{m ? `${m.prenom} ${m.nom}` : 'Membre'}</strong> ({kourel ? kourel.nom.split('—')[1] || kourel.nom : 'Kourel'})
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terminé le {item.date_validee || '16 août'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-ht-sage text-sm italic">
                  Aucune partie terminée trouvée.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Parties Restantes (En cours / À faire) */}
          {activeTab === 'encours' && (
            <div className="space-y-3">
              {filteredRestants.length > 0 ? (
                filteredRestants.map((item) => {
                  const m = membres.find((mem) => mem.id === item.membre_id);
                  const kourel = m ? kourels.find((k) => k.id === m.kourel_id) : null;
                  const isEnCours = item.statut === 'En cours';

                  return (
                    <div
                      key={item.juz}
                      className="p-4 bg-white rounded-2xl border border-ht-line flex items-center justify-between gap-4 shadow-xs hover:border-amber-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-2xl text-white font-black text-sm flex items-center justify-center shadow-sm ${
                            isEnCours ? 'bg-amber-500' : 'bg-slate-400'
                          }`}
                        >
                          {item.juz}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-ht-ink">
                            Juki {item.juz} — <span className="text-ht-sage">{item.nom_juz || `Portion ${item.juz}`}</span>
                          </div>
                          <div className="text-xs text-ht-sage mt-0.5">
                            Attribué à <strong className="text-ht-ink">{m ? `${m.prenom} ${m.nom}` : 'Membre non assigné'}</strong> ({kourel ? kourel.nom.split('—')[1] || kourel.nom : 'Kourel'})
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`px-3 py-1 font-extrabold text-xs rounded-full border inline-flex items-center gap-1 ${
                            isEnCours
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.statut}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-ht-sage text-sm italic">
                  Toutes les portions du Coran ont été récitées !
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Membres Impliqués Uniquement */}
          {activeTab === 'membres' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((membre) => {
                  const kourel = kourels.find((k) => k.id === membre.kourel_id);
                  const assignedJukis = memberAssignmentsMap[membre.id] || [];
                  const terminesCount = assignedJukis.filter((a) => a.statut === 'Terminé').length;

                  return (
                    <div
                      key={membre.id}
                      className="bg-ht-page/80 rounded-2xl p-5 border border-ht-line space-y-4 shadow-xs hover:border-ht-mint transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-emerald text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                            {membre.prenom[0]}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-ht-ink">
                              {membre.prenom} {membre.nom}
                            </h4>
                            <p className="text-[11px] text-ht-sage font-medium">
                              {kourel ? kourel.nom.split('—')[1] || kourel.nom : 'Kourel'} • {membre.telephone}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 bg-ht-mist text-ht-emerald font-extrabold text-xs rounded-full border border-ht-mint">
                          {terminesCount}/{assignedJukis.length} Fait(s)
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-ht-sage uppercase tracking-wider block">
                          Juki Attribué(s) :
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {assignedJukis.map((item) => (
                            <div
                              key={item.juz}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border shadow-xs ${
                                item.statut === 'Terminé'
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : item.statut === 'En cours'
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white text-slate-600 border-slate-300'
                              }`}
                            >
                              <span>Juki {item.juz}</span>
                              <span className="text-[10px] opacity-90">({item.statut})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-ht-sage text-sm italic">
                  Aucun membre ne correspond à la recherche.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Historique des Cycles Kamil */}
          {activeTab === 'cycles' && (
            <div className="space-y-3">
              {filteredPastCycles.length > 0 ? (
                filteredPastCycles.map((c) => (
                  <div
                    key={c.id || c.numero_cycle}
                    className="p-5 bg-white rounded-2xl border border-ht-line flex items-center justify-between gap-4 shadow-xs hover:border-ht-mint transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                        #{c.numero_cycle}
                      </div>
                      <div>
                        <div className="font-extrabold text-base text-ht-ink">
                          Cycle Kamil #{c.numero_cycle} — <span className="text-ht-emerald">Lecture Clôturée</span>
                        </div>
                        <div className="text-xs text-ht-sage mt-0.5">
                          Du {c.date_debut || '01/08/2026'} au {c.date_fin_prevue || '15/08/2026'} • 30 Juki complétés
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Kamil Réussi 100%</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-ht-sage text-sm italic">
                  Aucun cycle passé enregistré dans l'historique.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-ht-line bg-ht-page/80 flex items-center justify-between text-xs">
          <span className="text-ht-sage font-medium">
            💡 {terminesList.length} sur 30 portions du Coran ont été récitées et validées.
          </span>
          <button
            onClick={onClose}
            className="btn-anim px-6 py-2.5 gradient-emerald text-white rounded-2xl font-bold shadow-md cursor-pointer"
          >
            Fermer la fenêtre
          </button>
        </div>
      </div>
    </div>
  );
};

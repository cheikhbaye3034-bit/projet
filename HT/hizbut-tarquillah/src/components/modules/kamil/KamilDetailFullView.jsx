import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  History, 
  Search, 
  ShieldCheck, 
  Phone, 
  ChevronRight, 
  Calendar, 
  Award, 
  Filter, 
  Sparkles,
  UserCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const KamilDetailFullView = ({ initialTab = 'termines', onClose, onOpenAttribution }) => {
  const { kamilCycle, membres, kourels, pastKamilCycles, updateJuzStatut } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab); // 'termines' | 'encours' | 'membres' | 'cycles'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKourel, setFilterKourel] = useState('all');

  useEffect(() => {
    setActiveTab(initialTab);
    setSearchQuery('');
  }, [initialTab]);

  const assignations = kamilCycle?.assignations || [];
  const terminesList = assignations.filter((a) => a.statut === 'Terminé');
  const restantsList = assignations.filter((a) => a.statut !== 'Terminé');
  const enCoursList = assignations.filter((a) => a.statut === 'En cours');
  const aFaireList = assignations.filter((a) => a.statut === 'À faire');

  // Group assignations by member
  const memberAssignmentsMap = {};
  assignations.forEach((a) => {
    if (!memberAssignmentsMap[a.membre_id]) {
      memberAssignmentsMap[a.membre_id] = [];
    }
    memberAssignmentsMap[a.membre_id].push(a);
  });

  const involvedMemberIds = Object.keys(memberAssignmentsMap);
  const involvedMembers = (membres || []).filter((m) => involvedMemberIds.includes(m.id));

  // Filtered members list
  const filteredMembers = involvedMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
    const phone = m.telephone || '';
    const assignedJukis = (memberAssignmentsMap[m.id] || []).map((a) => `juki ${a.juz} portion ${a.juz}`).join(' ');
    const matchesKourel = filterKourel === 'all' || m.kourel_id === filterKourel;
    return (fullName.includes(q) || phone.includes(q) || assignedJukis.includes(q)) && matchesKourel;
  });

  // Filtered completed list
  const filteredTermines = terminesList.filter((a) => {
    const q = searchQuery.toLowerCase();
    const m = membres.find((mem) => mem.id === a.membre_id);
    const memberName = m ? `${m.prenom} ${m.nom}`.toLowerCase() : '';
    const matchesKourel = filterKourel === 'all' || (m && m.kourel_id === filterKourel);
    return (
      (`juki ${a.juz}`.includes(q) ||
       `${a.juz}`.includes(q) ||
       memberName.includes(q) ||
       (a.nom_juz && a.nom_juz.toLowerCase().includes(q))) && matchesKourel
    );
  });

  // Filtered in-progress / to-do list
  const filteredRestants = restantsList.filter((a) => {
    const q = searchQuery.toLowerCase();
    const m = membres.find((mem) => mem.id === a.membre_id);
    const memberName = m ? `${m.prenom} ${m.nom}`.toLowerCase() : '';
    const matchesKourel = filterKourel === 'all' || (m && m.kourel_id === filterKourel);
    return (
      (`juki ${a.juz}`.includes(q) ||
       `${a.juz}`.includes(q) ||
       memberName.includes(q) ||
       (a.nom_juz && a.nom_juz.toLowerCase().includes(q))) && matchesKourel
    );
  });

  // Filtered past cycles
  const filteredPastCycles = (pastKamilCycles || []).filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      `cycle ${c.numero_cycle}`.includes(q) ||
      `${c.numero_cycle}`.includes(q) ||
      (c.date_debut && c.date_debut.includes(q)) ||
      (c.date_fin_prevue && c.date_fin_prevue.includes(q))
    );
  });

  const completionPercent = Math.round((terminesList.length / 30) * 100);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Top Action Bar: Back button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-soft-xs transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
          <span>Retour au Tableau Kamil</span>
        </button>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Cycle Actif #{kamilCycle?.numero_cycle || 1}
          </span>

          {onOpenAttribution && (
            <button
              onClick={onOpenAttribution}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assigner les Jukis</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-800 text-white font-display font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md flex-shrink-0">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-100" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 leading-tight">
                {activeTab === 'termines' && 'Détail des Jukis Validés'}
                {activeTab === 'encours' && 'Jukis Restants & En Cours'}
                {activeTab === 'membres' && 'Lecteurs Actifs & Affectations'}
                {activeTab === 'cycles' && 'Historique des Cycles Complétés'}
              </h1>
              
              <span className="px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                {completionPercent}% Complété
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {activeTab === 'termines' && `${terminesList.length} portions sur 30 ont été intégralement lues et validées.`}
              {activeTab === 'encours' && `${restantsList.length} portions restantes (${enCoursList.length} en cours, ${aFaireList.length} à faire).`}
              {activeTab === 'membres' && `${involvedMembers.length} lecteurs mobilisés pour la lecture collective du Coran.`}
              {activeTab === 'cycles' && `Consultez les archives et les statistiques des cycles passés.`}
            </p>
          </div>
        </div>

        {/* Quick Progression Pill on Right */}
        <div className="w-full md:w-auto bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-around md:justify-end gap-6 flex-shrink-0">
          <div className="text-center">
            <div className="font-display font-black text-xl text-emerald-800">
              {terminesList.length}/30
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Validés
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <div className="font-display font-black text-xl text-amber-700">
              {restantsList.length}/30
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Restants
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <div className="font-display font-black text-xl text-blue-700">
              {involvedMembers.length}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Lecteurs
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Bar & Search Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        
        {/* Modern Segmented Tab Bar Container */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('termines')}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'termines'
                ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${activeTab === 'termines' ? 'text-emerald-700' : 'text-slate-400'}`} />
            <span>Validés</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'termines' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {terminesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('encours')}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'encours'
                ? 'bg-white text-amber-950 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Clock className={`w-4 h-4 ${activeTab === 'encours' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Restants</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'encours' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {restantsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('membres')}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'membres'
                ? 'bg-white text-blue-950 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'membres' ? 'text-blue-700' : 'text-slate-400'}`} />
            <span>Lecteurs</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'membres' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {involvedMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cycles')}
            className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cycles'
                ? 'bg-white text-purple-950 shadow-sm border border-slate-200/80 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <History className={`w-4 h-4 ${activeTab === 'cycles' ? 'text-purple-700' : 'text-slate-400'}`} />
            <span>Historique</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'cycles' ? 'bg-purple-100 text-purple-900' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {pastKamilCycles?.length || 6}
            </span>
          </button>
        </div>

        {/* Filter & Search Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'cycles' ? "Rechercher par numéro de cycle ou date..." : "Rechercher un membre, un Juki, une sourate..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 transition-all shadow-inner"
            />
          </div>

          {activeTab !== 'cycles' && (
            <div className="flex items-center gap-2">
              <select
                value={filterKourel}
                onChange={(e) => setFilterKourel(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10 transition-all cursor-pointer"
              >
                <option value="all">Tous les Kourels</option>
                {(kourels || []).map((k) => (
                  <option key={k.id} value={k.id}>{k.nom}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: Jukis Validés (Terminés) */}
        {activeTab === 'termines' && (
          <div className="pt-2">
            {filteredTermines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTermines.map((item) => {
                  const m = membres.find((mem) => mem.id === item.membre_id);
                  const kourel = m ? kourels.find((k) => k.id === m.kourel_id) : null;

                  return (
                    <div
                      key={item.juz}
                      className="p-5 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-black text-base flex items-center justify-center shadow-sm">
                          {item.juz}
                        </div>

                        <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-black text-[11px] rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Validé</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                          Juki {item.juz} — <span className="text-emerald-800 font-extrabold">{item.nom_juz || `Portion ${item.juz}`}</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          Récité par : <strong className="text-slate-800 font-bold">{m ? `${m.prenom} ${m.nom}` : 'Membre assigné'}</strong>
                        </p>
                        {kourel && (
                          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {kourel.nom}
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>Date de validation :</span>
                        <span className="text-slate-700 font-bold">{item.date_validee || 'Enregistré'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm font-semibold bg-slate-50 rounded-2xl border border-slate-200">
                Aucun Juki validé correspondant à votre recherche.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Jukis Restants (En cours / À faire) */}
        {activeTab === 'encours' && (
          <div className="pt-2">
            {filteredRestants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestants.map((item) => {
                  const m = membres.find((mem) => mem.id === item.membre_id);
                  const kourel = m ? kourels.find((k) => k.id === m.kourel_id) : null;
                  const isEnCours = item.statut === 'En cours';

                  return (
                    <div
                      key={item.juz}
                      className={`p-5 rounded-3xl border transition-all space-y-3 ${
                        isEnCours
                          ? 'bg-amber-50/40 hover:bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
                          : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl text-white font-black text-base flex items-center justify-center shadow-sm ${
                            isEnCours ? 'bg-amber-600' : 'bg-slate-400'
                          }`}
                        >
                          {item.juz}
                        </div>

                        <span
                          className={`px-3 py-1 font-black text-[11px] rounded-full border flex items-center gap-1 ${
                            isEnCours
                              ? 'bg-amber-100 text-amber-900 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.statut}</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                          Juki {item.juz} — <span className="text-slate-700">{item.nom_juz || `Portion ${item.juz}`}</span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          Attribué à : <strong className="text-slate-800 font-bold">{m ? `${m.prenom} ${m.nom}` : 'Non assigné'}</strong>
                        </p>
                        {m?.telephone && (
                          <p className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{m.telephone}</span>
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => updateJuzStatut(item.juz, isEnCours ? 'Terminé' : 'En cours')}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isEnCours
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-amber-500 hover:bg-amber-600 text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isEnCours ? 'Valider comme Terminé' : 'Passer en cours'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-emerald-800 text-sm font-bold bg-emerald-50 rounded-2xl border border-emerald-200">
                🎉 Toutes les 30 portions du Coran ont été intégralement terminées !
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Lecteurs Actifs (Affectations par Membre) */}
        {activeTab === 'membres' && (
          <div className="pt-2">
            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((membre) => {
                  const kourel = kourels.find((k) => k.id === membre.kourel_id);
                  const assignedJukis = memberAssignmentsMap[membre.id] || [];
                  const terminesCount = assignedJukis.filter((a) => a.statut === 'Terminé').length;
                  const percent = assignedJukis.length > 0 ? Math.round((terminesCount / assignedJukis.length) * 100) : 0;

                  return (
                    <div
                      key={membre.id}
                      className="p-5 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white font-display font-black text-lg flex items-center justify-center shadow-sm">
                            {membre.prenom?.[0]}{membre.nom?.[0]}
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                              {membre.prenom} {membre.nom}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {kourel ? kourel.nom : 'Dahira Hizbut-Tarqiyyah'}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold text-xs rounded-xl border border-blue-200">
                          {assignedJukis.length} Juki(s)
                        </span>
                      </div>

                      {/* Jukis List for this member */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Portions attribuées :
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {assignedJukis.map((a) => (
                            <span
                              key={a.juz}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 border ${
                                a.statut === 'Terminé'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                                  : a.statut === 'En cours'
                                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                                  : 'bg-slate-200 text-slate-700 border-slate-300'
                              }`}
                            >
                              <span>Juki {a.juz}</span>
                              {a.statut === 'Terminé' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                              {a.statut === 'En cours' && <Clock className="w-3 h-3 text-amber-700" />}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Progression Bar */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>Progression</span>
                          <span className="text-blue-800">{terminesCount}/{assignedJukis.length} validé(s)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm font-semibold bg-slate-50 rounded-2xl border border-slate-200">
                Aucun lecteur trouvé pour ce filtre.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Historique des Cycles Complétés */}
        {activeTab === 'cycles' && (
          <div className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(filteredPastCycles.length > 0 ? filteredPastCycles : [
                { id: 'c41', numero_cycle: 41, date_debut: '2026-08-01', date_fin_prevue: '2026-08-15', statut: 'Complété', participants_count: 28, duree_jours: 14 },
                { id: 'c40', numero_cycle: 40, date_debut: '2026-07-15', date_fin_prevue: '2026-07-30', statut: 'Complété', participants_count: 30, duree_jours: 15 },
                { id: 'c39', numero_cycle: 39, date_debut: '2026-07-01', date_fin_prevue: '2026-07-15', statut: 'Complété', participants_count: 27, duree_jours: 14 },
                { id: 'c38', numero_cycle: 38, date_debut: '2026-06-15', date_fin_prevue: '2026-06-30', statut: 'Complété', participants_count: 30, duree_jours: 15 },
                { id: 'c37', numero_cycle: 37, date_debut: '2026-06-01', date_fin_prevue: '2026-06-15', statut: 'Complété', participants_count: 29, duree_jours: 14 },
                { id: 'c36', numero_cycle: 36, date_debut: '2026-05-15', date_fin_prevue: '2026-05-30', statut: 'Complété', participants_count: 30, duree_jours: 15 },
              ]).map((cycle) => (
                <div
                  key={cycle.id || cycle.numero_cycle}
                  className="p-5 bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-800 text-white font-black text-base flex items-center justify-center shadow-sm">
                      #{cycle.numero_cycle}
                    </div>

                    <span className="px-3 py-1 bg-purple-100 text-purple-900 font-black text-[11px] rounded-full border border-purple-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-purple-700" />
                      <span>{cycle.statut || 'Complété'}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">
                      Kamil #{cycle.numero_cycle} — Lecture Intégrale
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Période : <strong className="text-slate-700">{cycle.date_debut}</strong> au <strong className="text-slate-700">{cycle.date_fin_prevue}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span>{cycle.participants_count || 30} lecteurs mobilisés</span>
                    <span className="text-purple-800 font-black">100% Validé (30/30)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

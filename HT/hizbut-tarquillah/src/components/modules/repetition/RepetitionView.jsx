import React, { useState } from 'react';
import { Calendar, Music, Mic, BookOpen, Volume2, CheckCircle2, Clock, Users, Plus, ChevronRight, BarChart3, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidasSubView } from './KhassidasSubView';
import { SonsSubView } from './SonsSubView';
import { EnregistrementsSubView } from './EnregistrementsSubView';
import { PointageTable } from './PointageTable';
import { NouvelleSeanceModal } from './NouvelleSeanceModal';
import { ResumeSeancesModal } from './ResumeSeancesModal';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const RepetitionView = () => {
  const { kourels, seances, khassidas, membres } = useApp();

  // Active sub-section state: 'khassidas' | 'sons' | 'enregistrements' | 'pointage'
  const [activeSubTab, setActiveSubTab] = useState('khassidas');

  const [selectedKourelId, setSelectedKourelId] = useState(kourels[0]?.id || 'k1');
  const [selectedSeanceId, setSelectedSeanceId] = useState(seances[0]?.id || 's1');

  // Modals state
  const [isNewSeanceModalOpen, setIsNewSeanceModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Filter seances for selected kourel
  const kourelSeances = seances ? seances.filter((s) => s.kourel_id === selectedKourelId) : [];
  const activeSeance = seances ? (seances.find((s) => s.id === selectedSeanceId) || kourelSeances[0]) : null;

  const membersOfKourel = membres ? membres.filter((m) => m.kourel_id === selectedKourelId) : [];
  const selectedKourel = kourels ? kourels.find((k) => k.id === selectedKourelId) : null;

  const subNavItems = [
    { id: 'khassidas', label: 'Khassidas à répéter', icon: BookOpen, count: khassidas?.length },
    { id: 'sons', label: 'Audios de Référence', icon: Music, count: 5 },
    { id: 'enregistrements', label: 'Enregistrements Live', icon: Mic, count: 4 },
    { id: 'pointage', label: 'Feuilles de Pointage', icon: Calendar, badge: 'Direct' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in select-none">
      
      {/* Top Grand Banner with Background Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-500/30 text-white p-6 sm:p-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMicBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/85 to-[#062418]/90 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Module Central • Répétitions & Pointage</span>
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Gestion des Répétitions & Khassidas
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Supervision des séances de chant, gestion du répertoire officiel et suivi de l'émargement des Kourels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <BarChart3 className="w-4 h-4 text-emerald-200" />
              <span>Bilan Global</span>
            </button>

            <button
              onClick={() => setIsNewSeanceModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Séance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-section Navigation Tabs Header */}
      <div className="pro-card p-2 sm:p-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {subNavItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive ? 'bg-emerald-200 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Sub-view Content based on activeSubTab */}
      {activeSubTab === 'khassidas' && <KhassidasSubView />}
      {activeSubTab === 'sons' && <SonsSubView />}
      {activeSubTab === 'enregistrements' && <EnregistrementsSubView />}

      {activeSubTab === 'pointage' && (
        <div className="space-y-6">
          {/* Top Kourel Selector & Action Header */}
          <div className="pro-card p-6 space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                  Module Pointage & Émargement
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-2">
                  {selectedKourel ? selectedKourel.nom : 'Kourel'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Superviseurs référents : <span className="font-bold text-slate-800">{selectedKourel?.superviseurs?.join(', ') || 'Superviseur'}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-2 transition-all active:scale-95"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Bilan & Statistiques</span>
                </button>

                <button
                  onClick={() => setIsNewSeanceModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 text-emerald-200" />
                  <span>Nouvelle Séance</span>
                </button>
              </div>
            </div>

            {/* Kourel & Séance Selectors row */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-1">Section :</span>
                {kourels.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      setSelectedKourelId(k.id);
                      const firstSeanceOfKourel = seances.find((s) => s.kourel_id === k.id);
                      if (firstSeanceOfKourel) setSelectedSeanceId(firstSeanceOfKourel.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                      selectedKourelId === k.id
                        ? 'bg-slate-900 text-white shadow-soft-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {k.nom.split('—')[1] || k.nom}
                  </button>
                ))}
              </div>

              {kourelSeances.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Séance active :</span>
                  <select
                    value={activeSeance?.id || ''}
                    onChange={(e) => setSelectedSeanceId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-900 font-bold text-xs border border-slate-200 focus:outline-none focus:border-emerald-600"
                  >
                    {kourelSeances.map((s) => (
                      <option key={s.id} value={s.id}>
                        Séance du {s.date} ({s.heure_debut} - {s.heure_fin})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Pointage Table */}
          {activeSeance ? (
            <PointageTable seance={activeSeance} membersOfKourel={membersOfKourel} />
          ) : (
            <div className="pro-card p-12 text-center text-slate-400 text-xs italic">
              Aucune séance enregistrée pour ce Kourel. Cliquez sur "Nouvelle Séance" pour démarrer un pointage.
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <NouvelleSeanceModal
        isOpen={isNewSeanceModalOpen}
        onClose={() => setIsNewSeanceModalOpen(false)}
        defaultKourelId={selectedKourelId}
        onSeanceCreated={(newSeanceId) => setSelectedSeanceId(newSeanceId)}
      />

      <ResumeSeancesModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        defaultKourelId={selectedKourelId}
      />
    </div>
  );
};

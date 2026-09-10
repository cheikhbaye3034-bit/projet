import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Clock, CheckCircle2, Award, Users, TrendingUp, ArrowUpRight, UserCheck, Eye, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JuzGrid } from './JuzGrid';
import { NouveauCycleModal } from './NouveauCycleModal';
import { AttributionJukiModal } from './AttributionJukiModal';
import { KamilDetailFullView } from './KamilDetailFullView';
import { KamilHistoryChart } from './KamilHistoryChart';
import kamilHeroQuran from '../../../assets/images/kamil_hero_quran.jpg';

export const KamilView = () => {
  const { kamilCycle, membres, pastKamilCycles } = useApp();
  const [isNouveauCycleModalOpen, setIsNouveauCycleModalOpen] = useState(false);
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState(false);
  
  // Full-page Details Tab state ('termines' | 'encours' | 'membres' | 'cycles' | null)
  const [selectedDetailTab, setSelectedDetailTab] = useState(null);

  const termines = kamilCycle ? kamilCycle.assignations.filter((a) => a.statut === 'Terminé' || a.statut === 'Validé').length : 0;
  const enCours = kamilCycle ? kamilCycle.assignations.filter((a) => a.statut === 'En cours').length : 0;
  const aFaire = kamilCycle ? kamilCycle.assignations.filter((a) => !a.membre_id || a.statut === 'À faire' || a.statut === 'Libre').length : 0;

  const membersInvolvedCount = kamilCycle ? new Set(kamilCycle.assignations.filter(a => a.membre_id && a.statut !== 'Libre' && a.statut !== 'À faire').map(a => a.membre_id)).size : 0;

  const today = new Date();
  const endDate = new Date(kamilCycle?.date_fin_prevue || Date.now());
  const diffTime = endDate - today;
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // If a detail tab is selected, display the full page view directly in-page (like MembreDetailDrawer)
  if (selectedDetailTab) {
    return (
      <div className="pb-12 animate-fade-in">
        <KamilDetailFullView
          initialTab={selectedDetailTab}
          onClose={() => setSelectedDetailTab(null)}
          onOpenAttribution={() => setIsAttributionModalOpen(true)}
        />
        <AttributionJukiModal
          isOpen={isAttributionModalOpen}
          onClose={() => setIsAttributionModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in select-none">
      
      {/* Grand Hero Banner with Holy Quran Background */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-500/40 text-white p-6 sm:p-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${kamilHeroQuran})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/98 via-slate-950/90 to-emerald-950/95 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 backdrop-blur-md border border-emerald-400/40 text-xs font-black text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Cycle Actif #{kamilCycle?.numero_cycle} • Échéance dans {daysRemaining} jours</span>
            </div>
            
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
              Kamil — Récitation Collective du Saint Coran
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-xl">
              Coordination de la lecture intégrale des 30 Jukis répartis entre les membres du Dahira.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
            <button
              onClick={() => setIsAttributionModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Assigner les Jukis</span>
            </button>

            <button
              onClick={() => setIsNouveauCycleModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Cycle</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Professional Clickable KPI Stat Cards (2x2 sur mobile, 4 colonnes sur desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Stat Card 1: Parties terminées */}
        <div
          onClick={() => setSelectedDetailTab('termines')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
          title="Cliquer pour ouvrir le détail complet des Jukis terminés"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200/80 group-hover:scale-105 transition-transform flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-100/70 text-emerald-800 text-[9px] sm:text-[10px] font-black rounded-full flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Détails</span>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-800 transition-colors">
              {termines}/30
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Jukis validés</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold underline flex-shrink-0">Liste ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Membres impliqués */}
        <div
          onClick={() => setSelectedDetailTab('membres')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
          title="Cliquer pour ouvrir la liste complète des lecteurs et affectations"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold border border-blue-200/80 group-hover:scale-105 transition-transform flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100/70 text-blue-800 text-[9px] sm:text-[10px] font-black rounded-full flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Membres</span>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 group-hover:text-blue-800 transition-colors">
              {membersInvolvedCount || 10}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Lecteurs</span>
              <span className="text-[9px] sm:text-[10px] text-blue-700 font-bold underline flex-shrink-0">Affect. ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 3: Parties en cours */}
        <div
          onClick={() => setSelectedDetailTab('encours')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
          title="Cliquer pour voir tous les Jukis restants"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200/80 group-hover:scale-105 transition-transform flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 bg-amber-100/70 text-amber-800 text-[9px] sm:text-[10px] font-black rounded-full flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Restants</span>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 group-hover:text-amber-800 transition-colors">
              {enCours + aFaire}/30
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Reste ({daysRemaining}j)</span>
              <span className="text-[9px] sm:text-[10px] text-amber-700 font-bold underline flex-shrink-0">Voir ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 4: Cycles terminés */}
        <div
          onClick={() => setSelectedDetailTab('cycles')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
          title="Cliquer pour voir l'historique complet des cycles"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold border border-purple-200/80 group-hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
            </div>
            <span className="px-1.5 sm:px-2 py-0.5 bg-purple-100/70 text-purple-800 text-[9px] sm:text-[10px] font-black rounded-full flex items-center gap-1">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Cycles</span>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 group-hover:text-purple-800 transition-colors">
              {(pastKamilCycles?.length || 0) + (kamilCycle?.numero_cycle ? kamilCycle.numero_cycle - 1 : 41)}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Complétés</span>
              <span className="text-[9px] sm:text-[10px] text-purple-700 font-bold underline flex-shrink-0">Arch. ➔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <JuzGrid onOpenAttribution={() => setIsAttributionModalOpen(true)} />

      {/* Kamil Cycles History & Evolution Chart */}
      <KamilHistoryChart />

      {/* Modals */}
      <NouveauCycleModal
        isOpen={isNouveauCycleModalOpen}
        onClose={() => setIsNouveauCycleModalOpen(false)}
      />

      <AttributionJukiModal
        isOpen={isAttributionModalOpen}
        onClose={() => setIsAttributionModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Clock, CheckCircle2, Award, Users, TrendingUp, ArrowUpRight, ArrowDownRight, UserCheck, Eye } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JuzGrid } from './JuzGrid';
import { NouveauCycleModal } from './NouveauCycleModal';
import { AttributionJukiModal } from './AttributionJukiModal';
import { KamilDetailsModal } from './KamilDetailsModal';
import { KamilHistoryChart } from './KamilHistoryChart';

export const KamilView = () => {
  const { kamilCycle, membres, pastKamilCycles } = useApp();
  const [isNouveauCycleModalOpen, setIsNouveauCycleModalOpen] = useState(false);
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState(false);
  
  // Details Modal state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsTab, setDetailsTab] = useState('membres'); // 'membres' | 'termines'

  const termines = kamilCycle.assignations.filter((a) => a.statut === 'Terminé').length;
  const enCours = kamilCycle.assignations.filter((a) => a.statut === 'En cours').length;
  const aFaire = kamilCycle.assignations.filter((a) => a.statut === 'À faire').length;

  const membersInvolvedCount = new Set(kamilCycle.assignations.map(a => a.membre_id)).size;

  const today = new Date();
  const endDate = new Date(kamilCycle.date_fin_prevue);
  const diffTime = endDate - today;
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleOpenDetails = (tab = 'membres') => {
    setDetailsTab(tab);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in select-none">
      {/* Top Title Header & Action CTAs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-ht-emerald uppercase tracking-widest mb-1">
            CYCLE EN COURS · ÉCHÉANCE LE 18 AOÛT
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
            Kamil — Lecture collective du Coran
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAttributionModalOpen(true)}
            className="btn-anim px-5 py-3 bg-ht-mist text-ht-emerald border border-ht-mint rounded-2xl text-xs font-extrabold shadow-sm hover:bg-ht-mint flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <UserCheck className="w-4 h-4 text-ht-emerald" />
            <span>👤 Assigner les 30 Juki</span>
          </button>

          <button
            onClick={() => setIsNouveauCycleModalOpen(true)}
            className="btn-anim px-5 py-3 gradient-emerald text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Lancer un Nouveau Cycle</span>
          </button>
        </div>
      </div>

      {/* 4 Professional Clickable KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat Card 1: Parties terminées (Clickable) */}
        <div
          onClick={() => handleOpenDetails('termines')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Cliquer pour voir le détail des Juki terminés"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Voir détail</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              {termines}/30
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1 flex items-center justify-between">
              <span>Parties terminées</span>
              <span className="text-[10px] text-ht-emerald font-bold underline">Cliquez pour voir ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2: Membres impliqués (Clickable) */}
        <div
          onClick={() => handleOpenDetails('membres')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Cliquer pour voir la liste des membres impliqués et leurs Juki"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Voir membres</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              {membersInvolvedCount || 10}
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1 flex items-center justify-between">
              <span>Membres impliqués</span>
              <span className="text-[10px] text-ht-emerald font-bold underline">Cliquez pour voir ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 3: Parties en cours / Jours restants (Clickable) */}
        <div
          onClick={() => handleOpenDetails('encours')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Cliquer pour voir les Juki en cours et à faire"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-ht-amber flex items-center justify-center font-bold border border-amber-200 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-ht-amber" />
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Voir restants</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink group-hover:text-ht-amber transition-colors">
              {enCours + aFaire}/30
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1 flex items-center justify-between">
              <span>Parties restantes ({daysRemaining}j restants)</span>
              <span className="text-[10px] text-ht-amber font-bold underline">Cliquez pour voir ➔</span>
            </div>
          </div>
        </div>

        {/* Stat Card 4: Cycles terminés (Clickable) */}
        <div
          onClick={() => handleOpenDetails('cycles')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Cliquer pour consulter l'historique des cycles Kamil"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-200 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Voir historique</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink group-hover:text-indigo-600 transition-colors">
              {kamilCycle.numero_cycle - 1}
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1 flex items-center justify-between">
              <span>Cycles terminés</span>
              <span className="text-[10px] text-indigo-600 font-bold underline">Cliquez pour voir ➔</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of 30 Juz */}
      <JuzGrid onOpenAttribution={() => setIsAttributionModalOpen(true)} />

      {/* Historical Cycles Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft space-y-4">
        <div>
          <div className="text-xs font-bold text-ht-sage uppercase tracking-wider mb-1">
            6 DERNIERS CYCLES
          </div>
          <h3 className="font-display font-bold text-xl text-ht-ink">
            Respect des échéances
          </h3>
        </div>

        <KamilHistoryChart />
      </div>

      {/* Modals */}
      <NouveauCycleModal
        isOpen={isNouveauCycleModalOpen}
        onClose={() => setIsNouveauCycleModalOpen(false)}
      />

      <AttributionJukiModal
        isOpen={isAttributionModalOpen}
        onClose={() => setIsAttributionModalOpen(false)}
      />

      <KamilDetailsModal
        isOpen={isDetailsModalOpen}
        initialTab={detailsTab}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  );
};

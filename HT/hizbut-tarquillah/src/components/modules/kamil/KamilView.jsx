import React, { useState } from 'react';
import { BookOpen, Plus, Calendar, Clock, CheckCircle2, Award, Users, TrendingUp, ArrowUpRight, ArrowDownRight, UserCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { JuzGrid } from './JuzGrid';
import { NouveauCycleModal } from './NouveauCycleModal';
import { AttributionJukiModal } from './AttributionJukiModal';
import { KamilHistoryChart } from './KamilHistoryChart';

export const KamilView = () => {
  const { kamilCycle, membres, pastKamilCycles } = useApp();
  const [isNouveauCycleModalOpen, setIsNouveauCycleModalOpen] = useState(false);
  const [isAttributionModalOpen, setIsAttributionModalOpen] = useState(false);

  const termines = kamilCycle.assignations.filter((a) => a.statut === 'Terminé').length;
  const enCours = kamilCycle.assignations.filter((a) => a.statut === 'En cours').length;
  const aFaire = kamilCycle.assignations.filter((a) => a.statut === 'À faire').length;

  const membersInvolvedCount = new Set(kamilCycle.assignations.map(a => a.membre_id)).size;

  const today = new Date();
  const endDate = new Date(kamilCycle.date_fin_prevue);
  const diffTime = endDate - today;
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAttributionModalOpen(true)}
            className="btn-anim px-5 py-3 bg-ht-mist text-ht-emerald border border-ht-mint rounded-2xl text-xs font-bold shadow-xs hover:bg-ht-mint flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>👤 Assigner les 30 Juki</span>
          </button>

          <button
            onClick={() => setIsNouveauCycleModalOpen(true)}
            className="btn-anim px-5 py-3 gradient-emerald text-white rounded-2xl text-xs font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Lancer un Nouveau Cycle</span>
          </button>
        </div>
      </div>

      {/* 4 Professional KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <CheckCircle2 className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>En avance</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {termines}/30
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Parties terminées</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <Users className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Tous kourels</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {membersInvolvedCount || 10}
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Membres impliqués</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-ht-amber flex items-center justify-center font-bold border border-amber-200">
              <Clock className="w-6 h-6 text-ht-amber" />
            </div>
            <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
              <span>Échéance proche</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {daysRemaining || 6}
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Jours restants</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <BookOpen className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+1 ce mois</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {kamilCycle.numero_cycle - 1}
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Cycles terminés</div>
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
    </div>
  );
};

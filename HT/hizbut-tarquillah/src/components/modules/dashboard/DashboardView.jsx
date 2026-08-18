import React from 'react';
import {
  CheckCircle2,
  Users,
  BookOpen,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  Mic,
  ArrowUpRight,
  Wallet,
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PresenceTrendChart } from './PresenceTrendChart';
import { KamilDonutChart } from './KamilDonutChart';
import bgDashboard from '../../../assets/images/bg_dashboard.jpg';

export const DashboardView = () => {
  const { membres, kamilCycle, informations, setActiveTab, kourels } = useApp();

  const totalMembresActifs = membres.filter(m => m.statut === 'Actif').length;
  const terminesKamil = kamilCycle.assignations.filter(a => a.statut === 'Terminé').length;
  const enCoursKamil = kamilCycle.assignations.filter(a => a.statut === 'En cours').length;
  const aFaireKamil = kamilCycle.assignations.filter(a => a.statut === 'À faire').length;
  const totalEnRegle = membres.filter(m => m.cotisation_statut === 'À jour').length;

  const khassidaProgress = [
    { titre: 'Mawahibou Nafi', percent: 85, color: 'bg-emerald-600' },
    { titre: 'Jalibatul Maratib', percent: 65, color: 'bg-emerald-500' },
    { titre: 'Assirou', percent: 92, color: 'bg-emerald-600' },
    { titre: 'Matlabul Fawzayni', percent: 45, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-10 animate-fade-in max-w-7xl mx-auto select-none">
      
      {/* 1. Hero Banner Dashboard (Exact Reference Screenshot 3) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ht-line">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgDashboard})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2a1f]/95 via-[#133d2e]/90 to-ht-emerald/70 backdrop-blur-[1px]" />

        <div className="relative z-10 p-8 sm:p-12 text-white max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-ht-mint shadow-inner">
            <Award className="w-4 h-4 text-ht-amber" />
            <span>Synthèse Globale & Pilotage des Activités</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl leading-tight tracking-tight">
            Tableau de Bord Hizbut Tarquillah
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            Vue d'ensemble complète sur les répétitions de Khassidas, la progression de la lecture du Coran (Juki) et l'assiduité des Kourels.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={() => setActiveTab('repetition')}
              className="btn-anim px-6 py-3 gradient-emerald text-white text-xs font-bold rounded-2xl shadow-lg flex items-center gap-2.5 hover:brightness-110 cursor-pointer"
            >
              <Mic className="w-4.5 h-4.5 text-white" />
              <span>Répétitions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('kamil')}
              className="btn-anim px-6 py-3 bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-2xl hover:bg-white/25 flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-4.5 h-4.5 text-ht-mint" />
              <span>Kamil Juki</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards (Exact Reference Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 - ASSIDUITÉ */}
        <div 
          onClick={() => setActiveTab('repetition')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ht-sage uppercase tracking-wider">
              ASSIDUITÉ
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4%</span>
            </span>
          </div>
          <div>
            <div className="font-display font-black text-4xl sm:text-5xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              87%
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1">
              Taux de présence global
            </div>
          </div>
        </div>

        {/* KPI 2 - KAMIL JUKI */}
        <div 
          onClick={() => setActiveTab('kamil')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ht-sage uppercase tracking-wider">
              KAMIL JUKI
            </span>
            <span className="px-2.5 py-1 bg-ht-mist text-ht-emerald text-xs font-extrabold rounded-full border border-ht-mint">
              Cycle #{kamilCycle.numero_cycle}
            </span>
          </div>
          <div>
            <div className="font-display font-black text-4xl sm:text-5xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              {terminesKamil}/30
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1">
              Juki terminés ce mois
            </div>
          </div>
        </div>

        {/* KPI 3 - MEMBRES */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ht-sage uppercase tracking-wider">
              MEMBRES
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
              {kourels.length} Kourels
            </span>
          </div>
          <div>
            <div className="font-display font-black text-4xl sm:text-5xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              {totalMembresActifs}
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1">
              Inscrits dans les groupes
            </div>
          </div>
        </div>

        {/* KPI 4 - COTISATIONS */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4 hover:border-ht-mint hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-ht-sage uppercase tracking-wider">
              COTISATIONS
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>En règle</span>
            </span>
          </div>
          <div>
            <div className="font-display font-black text-4xl sm:text-5xl text-ht-ink group-hover:text-ht-emerald transition-colors">
              {totalEnRegle}/{membres.length}
            </div>
            <div className="text-xs text-ht-sage font-semibold mt-1">
              Règlements à jour
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section PROGRAMMES & MAÎTRISE (Exact Reference Screenshot 1 & 2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-ht-line pb-5">
          <div>
            <div className="text-xs font-extrabold text-ht-emerald uppercase tracking-wider mb-1">
              PROGRAMMES & MAÎTRISE
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ht-ink">
              Avancement des Différentes Activités
            </h2>
          </div>
          <span className="text-xs font-semibold text-ht-sage bg-ht-page px-3 py-1.5 rounded-full border border-ht-line">
            Progression mensuelle
          </span>
        </div>

        {/* Khassidas & Kourels Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sub-section 1: Apprentissage des Khassidas */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-base text-ht-ink flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-ht-emerald" />
              <span>📖 Apprentissage des Khassidas</span>
            </h3>

            <div className="space-y-3.5">
              {khassidaProgress.map((kh, idx) => (
                <div key={idx} className="p-4 bg-ht-page/90 rounded-2xl border border-ht-line/80 space-y-2.5 hover:border-ht-mint transition-colors">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-ht-ink font-extrabold text-sm">{kh.titre}</span>
                    <span className="text-ht-emerald font-black text-sm">{kh.percent}%</span>
                  </div>
                  <div className="w-full bg-ht-line h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${kh.color} rounded-full transition-all duration-700 shadow-xs`}
                      style={{ width: `${kh.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-section 2: Assiduité par Kourel */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-base text-ht-ink flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-ht-emerald" />
              <span>👥 Assiduité par Kourel</span>
            </h3>

            <div className="space-y-3.5">
              {kourels.map((k) => {
                const count = membres.filter(m => m.kourel_id === k.id).length;
                const percent = k.id === 'k1' ? 92 : (k.id === 'k2' ? 85 : (k.id === 'k3' ? 78 : 95));
                const supervisor = k.superviseurs ? k.superviseurs[0] : 'Serigne Modou Kara';

                return (
                  <div key={k.id} className="p-4 bg-ht-page/90 rounded-2xl border border-ht-line/80 flex items-center justify-between gap-4 hover:border-ht-mint transition-colors">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-sm text-ht-ink">{k.nom}</div>
                      <div className="text-xs text-ht-sage font-medium">
                        Supervisé par <span className="text-ht-ink font-semibold">{supervisor}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="px-3.5 py-1.5 bg-ht-mist text-ht-emerald text-xs font-black rounded-full border border-ht-mint shadow-xs inline-block">
                        {percent}% Présence
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Charts Grid (Presence Trend & Kamil Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-xs font-extrabold text-ht-sage uppercase tracking-wider mb-1">
                8 DERNIÈRES SÉANCES
              </div>
              <h3 className="font-display font-bold text-xl text-ht-ink">
                Évolution de la présence
              </h3>
            </div>
            <div className="font-display font-extrabold text-3xl text-ht-emerald">
              87%
            </div>
          </div>
          <PresenceTrendChart />
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-ht-sage uppercase tracking-wider mb-1">
              CYCLE KAMIL EN COURS
            </div>
            <h3 className="font-display font-bold text-xl text-ht-ink mb-4">
              Répartition des 30 Juki
            </h3>
            <KamilDonutChart />
          </div>

          <div className="mt-6 pt-4 border-t border-ht-line space-y-2.5 text-xs font-medium">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#1F6B4B]"></span>
                <span className="text-emerald-900 font-bold">Terminé</span>
              </div>
              <span className="font-extrabold text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full">{terminesKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#D97706]"></span>
                <span className="text-amber-900 font-bold">En cours</span>
              </div>
              <span className="font-extrabold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full">{enCoursKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#CBD5E1]"></span>
                <span className="text-slate-700 font-bold">À faire</span>
              </div>
              <span className="font-extrabold text-slate-700 bg-slate-200 px-3 py-0.5 rounded-full">{aFaireKamil}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

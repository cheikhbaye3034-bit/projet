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
  Sparkles,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PresenceTrendChart } from './PresenceTrendChart';
import { KamilDonutChart } from './KamilDonutChart';
import bgDashboard from '../../../assets/images/bg_dashboard.jpg';

export const DashboardView = () => {
  const { membres, kamilCycle, informations, setActiveTab, kourels } = useApp();

  const totalMembresActifs = membres ? membres.filter(m => m.statut === 'Actif').length : 0;
  const terminesKamil = kamilCycle ? kamilCycle.assignations.filter(a => a.statut === 'Terminé').length : 0;
  const enCoursKamil = kamilCycle ? kamilCycle.assignations.filter(a => a.statut === 'En cours').length : 0;
  const aFaireKamil = kamilCycle ? kamilCycle.assignations.filter(a => a.statut === 'À faire').length : 0;
  const totalEnRegle = membres ? membres.filter(m => m.cotisation_statut === 'À jour').length : 0;

  const khassidaProgress = [
    { titre: 'Mawahibou Nafi', percent: 85, color: 'bg-emerald-600' },
    { titre: 'Jalibatul Maratib', percent: 65, color: 'bg-emerald-500' },
    { titre: 'Assirou', percent: 92, color: 'bg-emerald-600' },
    { titre: 'Matlabul Fawzayni', percent: 45, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-7xl mx-auto select-none">
      
      {/* 1. Hero SaaS Pro Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-emerald-900/10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgDashboard})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-900/80 backdrop-blur-[1px]" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Pilotage Analytique & Indicateurs Stratégiques</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            Tableau de Bord & Métriques
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Supervision transversale de l'assiduité, de la progression de la mémorisation des Khassidas et de l'état d'avancement du Kamil Coranique.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('repetition')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-2 transition-all active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-200" />
              <span>Gérer les Répétitions</span>
            </button>
            
            <button
              onClick={() => setActiveTab('kamil')}
              className="px-5 py-2.5 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Suivi Kamil Coran</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1 - ASSIDUITÉ */}
        <div 
          onClick={() => setActiveTab('repetition')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              ASSIDUITÉ MOYENNE
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100/70 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>+4%</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 group-hover:text-emerald-800 transition-colors">
              87%
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Taux de présence global
            </div>
          </div>
        </div>

        {/* KPI 2 - KAMIL JUKI */}
        <div 
          onClick={() => setActiveTab('kamil')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              KAMIL CORAN
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200">
              Cycle #{kamilCycle?.numero_cycle}
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 group-hover:text-emerald-800 transition-colors">
              {terminesKamil}/30
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Juz' terminés ce cycle
            </div>
          </div>
        </div>

        {/* KPI 3 - MEMBRES */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              EFFECTIFS ACTIFS
            </span>
            <span className="px-2.5 py-0.5 bg-blue-100/70 text-blue-800 text-[10px] font-black rounded-full">
              {kourels?.length} Sections
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 group-hover:text-blue-800 transition-colors">
              {totalMembresActifs}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Membres opérationnels
            </div>
          </div>
        </div>

        {/* KPI 4 - COTISATIONS */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              COTISATIONS
            </span>
            <span className="px-2.5 py-0.5 bg-purple-100/70 text-purple-800 text-[10px] font-black rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-purple-600" />
              <span>À jour</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-3xl sm:text-4xl text-slate-900 group-hover:text-purple-800 transition-colors">
              {totalEnRegle}/{membres?.length}
            </div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              Membres en règle
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section PROGRAMMES & MAÎTRISE */}
      <div className="pro-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-1">
              PROGRAMMES & MAÎTRISE
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900">
              Progression Pédagogique des Kourels
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Mise à jour mensuelle
          </span>
        </div>

        {/* Khassidas & Kourels Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Sub-section 1: Apprentissage des Khassidas */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Maîtrise des Khassidas</span>
            </h3>

            <div className="space-y-3">
              {khassidaProgress.map((kh, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 hover:border-emerald-200 transition-colors">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900">{kh.titre}</span>
                    <span className="text-emerald-800 font-black">{kh.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full ${kh.color} rounded-full transition-all duration-700`}
                      style={{ width: `${kh.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-section 2: Assiduité par Kourel */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Assiduité par Kourel</span>
            </h3>

            <div className="space-y-3">
              {kourels && kourels.map((k) => {
                const count = membres ? membres.filter(m => m.kourel_id === k.id).length : 0;
                const percent = k.id === 'k1' ? 92 : (k.id === 'k2' ? 85 : (k.id === 'k3' ? 78 : 95));
                const supervisor = k.superviseurs ? k.superviseurs[0] : 'Serigne Modou Kara';

                return (
                  <div key={k.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4 hover:border-emerald-200 transition-colors">
                    <div>
                      <div className="font-bold text-xs text-slate-900">{k.nom}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Superviseur : <span className="font-semibold text-slate-800">{supervisor}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="px-3 py-1 bg-emerald-100/80 text-emerald-800 text-xs font-black rounded-full">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pro-card p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                8 DERNIÈRES SÉANCES
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Évolution de la présence
              </h3>
            </div>
            <div className="font-display font-black text-3xl text-emerald-800">
              87%
            </div>
          </div>
          <PresenceTrendChart />
        </div>

        <div className="pro-card p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
              CYCLE EN COURS
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
              Répartition des 30 Juz'
            </h3>
            <KamilDonutChart />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-emerald-950 font-bold">Terminés</span>
              </div>
              <span className="font-black text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">{terminesKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span className="text-amber-950 font-bold">En cours</span>
              </div>
              <span className="font-black text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">{enCoursKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-slate-700 font-bold">À faire</span>
              </div>
              <span className="font-black text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">{aFaireKamil}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

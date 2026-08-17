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
  Wallet
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PresenceTrendChart } from './PresenceTrendChart';
import { KamilDonutChart } from './KamilDonutChart';
import { KourelAssiduiteChart } from './KourelAssiduiteChart';
import bgDashboard from '../../../assets/images/bg_dashboard.jpg';

export const DashboardView = () => {
  const { membres, kamilCycle, informations, setActiveTab, kourels } = useApp();

  const totalMembresActifs = membres.filter(m => m.statut === 'Actif').length;
  const terminesKamil = kamilCycle.assignations.filter(a => a.statut === 'Terminé').length;
  const enCoursKamil = kamilCycle.assignations.filter(a => a.statut === 'En cours').length;
  const aFaireKamil = kamilCycle.assignations.filter(a => a.statut === 'À faire').length;
  const totalEnRegle = membres.filter(m => m.cotisation_statut === 'À jour').length;

  const lastNews = informations.find(i => i.epingle) || informations[0] || {
    categorie: 'Événement',
    titre: 'Grand Magal de Touba 2026',
    contenu: 'Organisation des convois et répétitions intensives.'
  };

  const khassidaProgress = [
    { titre: 'Mawahibou Nafi', niveau: 'Avancé', percent: 85, color: 'bg-ht-emerald' },
    { titre: 'Jalibatul Maratib', niveau: 'Intermédiaire', percent: 65, color: 'bg-ht-fern' },
    { titre: 'Assirou', niveau: 'Débutant', percent: 92, color: 'bg-emerald-600' },
    { titre: 'Matlabul Fawzayni', niveau: 'Avancé', percent: 45, color: 'bg-ht-amber' },
  ];

  return (
    <div className="space-y-8 pb-10 animate-fade-in max-w-6xl mx-auto select-none">
      
      {/* 1. Hero Banner Dashboard with Image 1779033727608.jpg */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ht-line">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgDashboard})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ht-ink/95 via-ht-ink/80 to-ht-emerald/50 backdrop-blur-[1px]" />

        <div className="relative z-10 p-8 sm:p-12 text-white max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-ht-mint">
            <Award className="w-4 h-4 text-ht-mint" />
            <span>Synthèse Globale & Vue d'Ensemble Spirituelle</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
            Tableau de Bord Hizbut-Tarqiyyah
          </h1>

          <p className="text-sm text-gray-200 leading-relaxed">
            Suivez en direct l'assiduité des Kourels, l'avancement de la lecture collective (Kamil Juki), le programme de répétitions et la situation financière.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('repetition')}
              className="btn-anim px-5 py-2.5 gradient-emerald text-white text-xs font-bold rounded-2xl shadow-md flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Session Répétition</span>
            </button>
            <button
              onClick={() => setActiveTab('kamil')}
              className="btn-anim px-5 py-2.5 bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-2xl hover:bg-white/25 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Suivi Kamil Juki</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <CheckCircle2 className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>87% Présences</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              87%
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Assiduité globale</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <BookOpen className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Cycle #{kamilCycle.numero_cycle}</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {terminesKamil}/30
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Juki complétés (Kamil)</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
              <Users className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kourels.length} Kourels</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {totalMembresActifs}
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Membres inscrits actifs</div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3 hover:border-ht-mint transition-all">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <Wallet className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{Math.round((totalEnRegle/membres.length)*100)}% En règle</span>
            </span>
          </div>
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-ht-ink">
              {totalEnRegle}/{membres.length}
            </div>
            <div className="text-xs text-ht-sage font-medium mt-1">Cotisations à jour</div>
          </div>
        </div>
      </div>

      {/* 3. Section Avancement des Différentes Activités */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-ht-line pb-4">
          <div>
            <div className="text-xs font-bold text-ht-emerald uppercase tracking-wider mb-1">
              ACTIVITÉS & PROGRAMMES
            </div>
            <h3 className="font-display font-bold text-xl text-ht-ink">
              Avancement des Différentes Activités
            </h3>
          </div>
          <span className="text-xs font-semibold text-ht-sage">Progression générale de l'Association</span>
        </div>

        {/* Khassidas Progression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-ht-ink flex items-center gap-2">
              <Mic className="w-4 h-4 text-ht-emerald" />
              <span>Niveau de maîtrise des Khassidas (Répétition)</span>
            </h4>

            <div className="space-y-3.5">
              {khassidaProgress.map((kh, idx) => (
                <div key={idx} className="p-3.5 bg-ht-page/80 rounded-2xl border border-ht-line space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-ht-ink">{kh.titre} <span className="text-ht-sage font-normal">({kh.niveau})</span></span>
                    <span className="text-ht-emerald">{kh.percent}%</span>
                  </div>
                  <div className="w-full bg-ht-line h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${kh.color} rounded-full transition-all duration-500`}
                      style={{ width: `${kh.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kourels Performance breakdown */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-ht-ink flex items-center gap-2">
              <Users className="w-4 h-4 text-ht-emerald" />
              <span>Assiduité et Participation par Kourel</span>
            </h4>

            <div className="space-y-3.5">
              {kourels.map((k) => {
                const count = membres.filter(m => m.kourel_id === k.id).length;
                const percent = k.id === 'k1' ? 92 : (k.id === 'k2' ? 85 : (k.id === 'k3' ? 78 : 88));

                return (
                  <div key={k.id} className="p-3.5 bg-ht-page/80 rounded-2xl border border-ht-line flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-ht-ink">{k.nom}</div>
                      <div className="text-[11px] text-ht-sage mt-0.5">{count} membres rattachés</div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-ht-mist text-ht-emerald text-xs font-extrabold rounded-full border border-ht-mint">
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
              <div className="text-xs font-bold text-ht-sage uppercase tracking-wider mb-1">
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
            <div className="text-xs font-bold text-ht-sage uppercase tracking-wider mb-1">
              CYCLE KAMIL EN COURS
            </div>
            <h3 className="font-display font-bold text-xl text-ht-ink mb-4">
              Répartition des 30 Juki
            </h3>
            <KamilDonutChart />
          </div>

          <div className="mt-6 pt-4 border-t border-ht-line space-y-2.5 text-xs font-medium">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#1F6B4B]"></span>
                <span className="text-emerald-900 font-semibold">Terminé</span>
              </div>
              <span className="font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">{terminesKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#D97706]"></span>
                <span className="text-amber-900 font-semibold">En cours</span>
              </div>
              <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">{enCoursKamil}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#CBD5E1]"></span>
                <span className="text-slate-700 font-semibold">À faire</span>
              </div>
              <span className="font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">{aFaireKamil}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { 
  Users, 
  Mic, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2,
  Bell,
  Clock,
  Layers,
  ArrowUpRight,
  Bookmark,
  Award
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import bgHero from '../../../assets/images/bg_hero.png';

export const AccueilView = () => {
  const { membres, kourels, kamilCycle, seances, informations, setActiveTab, jukis } = useApp();

  const totalMembresActifs = membres ? membres.filter(m => m.statut === 'Actif').length : 0;
  const totalCotisationsEnRegle = membres ? membres.filter(m => m.cotisation_statut === 'À jour').length : 0;
  const recentSeances = seances ? seances.slice(0, 4) : [];
  const pinnedInfo = informations ? (informations.find(i => i.epingle) || informations[0]) : null;

  // Calculs Kamil
  const totalJukisLus = jukis ? jukis.filter(j => j.statut === 'Lu' || j.statut === 'Validé').length : 0;
  const totalJukisAttribues = jukis ? jukis.filter(j => j.statut === 'Attribué').length : 0;
  const kamilCompletionPercent = Math.round((totalJukisLus / 60) * 100);

  return (
    <div className="space-y-8 pb-12 animate-fade-in select-none">
      {/* Hero SaaS Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-emerald-900/10">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-105"
          style={{ backgroundImage: `url(${bgHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/90 to-slate-900/80 backdrop-blur-[2px]" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Portail Officiel • Hizbut-Tarqiyyah Pro</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.2]">
            Tableau de Bord & Pilotage Spirituel
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl">
            Gestion centralisée des répétitions de Khassidas, coordination automatisée des cycles de Kamil (60 Jukis) et suivi rigoureux de l'assiduité des membres.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('repetition')}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 group active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-200" />
              <span>Gérer les Répétitions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('kamil')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Suivi Kamil ({totalJukisLus}/60)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Membres */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-emerald-200/60 shadow-soft-xs">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              {totalMembresActifs} Actifs
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-2xl text-slate-900 tracking-tight">{membres.length}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span>Membres enregistrés</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </div>
          </div>
        </div>

        {/* Kourels / Répétitions */}
        <div 
          onClick={() => setActiveTab('repetition')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-amber-200/60 shadow-soft-xs">
              <Mic className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-[11px] font-black text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full">
              {kourels.length} Sections
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-2xl text-slate-900 tracking-tight">{seances.length}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span>Séances de répétition</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition-colors" />
            </div>
          </div>
        </div>

        {/* Cycle Kamil */}
        <div 
          onClick={() => setActiveTab('kamil')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-blue-200/60 shadow-soft-xs">
              <BookOpen className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-[11px] font-black text-blue-800 bg-blue-100/70 px-2.5 py-1 rounded-full">
              {kamilCompletionPercent}% Complété
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-2xl text-slate-900 tracking-tight">Cycle #{kamilCycle.numero_cycle}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span>60 Jukis Coraniques</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-colors" />
            </div>
          </div>
        </div>

        {/* Cotisations */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="pro-card p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-purple-200/60 shadow-soft-xs">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-[11px] font-black text-purple-800 bg-purple-100/70 px-2.5 py-1 rounded-full">
              {Math.round((totalCotisationsEnRegle / (membres.length || 1)) * 100)}% En règle
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display font-black text-2xl text-slate-900 tracking-tight">{totalCotisationsEnRegle} / {membres.length}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span>Cotisations régulières</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kourels Management Cards */}
          <div className="pro-card p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  Kourels & Sections de Chant
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Affectation des membres et encadrement pédagogique</p>
              </div>
              <button 
                onClick={() => setActiveTab('repetition')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span>Accéder</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kourels.map((k) => {
                const countMembers = membres.filter(m => m.kourel_id === k.id).length;
                return (
                  <div 
                    key={k.id}
                    onClick={() => setActiveTab('repetition')}
                    className="p-4 bg-slate-50/70 hover:bg-emerald-50/50 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer space-y-2 group shadow-soft-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors truncate max-w-[180px]">
                        {k.nom.split('—')[1] || k.nom}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-emerald-800 border border-emerald-200 shadow-soft-xs">
                        {countMembers} membre{countMembers > 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {k.description}
                    </p>
                    <div className="text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="truncate">Superviseur : {k.superviseurs[0]}</span>
                      <span className="text-emerald-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        <span>Voir</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kamil Cycle Progress Modern Widget */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-soft-xl space-y-5 border border-emerald-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Suivi du Kamil #{kamilCycle.numero_cycle}</h3>
                  <p className="text-[11px] text-slate-300">Récitation intégrale du Saint Coran (30 Jukis)</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
                {kamilCycle.statut}
              </span>
            </div>

            {/* Progress metrics */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Avancement des lectures</span>
                <span className="text-amber-400">
                  {totalJukisLus} / 60 Jukis complétés ({kamilCompletionPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(kamilCompletionPercent, 5)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
              <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {totalJukisLus} Lus
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {totalJukisAttribues} En cours
                </span>
              </div>
              <button
                onClick={() => setActiveTab('kamil')}
                className="px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span>Accéder à la Grille</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Announcement & Recent Sessions */}
        <div className="space-y-6">
          {/* Pinned Info Card */}
          {pinnedInfo && (
            <div className="pro-card p-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-wider">
                  <Bookmark className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Annonce Officielle</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{pinnedInfo.date_publication}</span>
              </div>
              <h4 className="font-display font-bold text-sm text-slate-900 leading-snug">
                {pinnedInfo.titre}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                {pinnedInfo.contenu}
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-[11px] text-slate-400 font-semibold">{pinnedInfo.auteur}</span>
                <button 
                  onClick={() => setActiveTab('info')}
                  className="text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
                >
                  <span>Détails</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Recent Sessions List */}
          <div className="pro-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Répétitions Récentes</span>
              </h4>
              <button 
                onClick={() => setActiveTab('repetition')}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-2.5">
              {recentSeances.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setActiveTab('repetition')}
                  className="p-3 bg-slate-50/80 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      Séance du {s.date}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {s.heure_debut} - {s.heure_fin} • {s.superviseur}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                    s.statut === 'Terminée' 
                      ? 'bg-emerald-100/80 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.statut}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

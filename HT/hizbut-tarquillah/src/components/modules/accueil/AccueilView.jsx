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
  const kamilAssignations = kamilCycle?.assignations || [];
  const totalJukisLus = kamilAssignations.filter(j => j.statut === 'Terminé' || j.statut === 'Validé').length;
  const totalJukisAttribues = kamilAssignations.filter(j => j.statut === 'En cours' || (j.membre_id && j.statut !== 'Libre' && j.statut !== 'À faire')).length;
  const kamilCompletionPercent = Math.round((totalJukisLus / 30) * 100);

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
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-4xl space-y-6">

          {/* Top Bismillah & Badge Sama Kourel */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3.5 pt-0.5">
            <span className="font-arabic text-lg sm:text-2xl text-amber-300/95 font-bold tracking-wider font-['Amiri',serif] drop-shadow-sm">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-amber-400/50 text-amber-300 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-calligraphy text-base sm:text-lg font-bold tracking-wider font-['Aref_Ruqaa','Amiri',serif] text-amber-300 drop-shadow-sm">
                Sama Kourel
              </span>
              <span className="text-amber-400/60">•</span>
              <span className="font-arabic text-base sm:text-lg font-bold text-emerald-200 drop-shadow-sm font-['Amiri',serif]">
                سَمَا كُورِيلْ
              </span>
            </div>
          </div>

          {/* Majestic Title */}
          <h1 className="font-serif font-bold text-2xl sm:text-4xl lg:text-5xl tracking-wide text-white leading-[1.2] drop-shadow-sm">
            Sanctuaire Numérique de Dévotion & de Gestion
          </h1>

          {/* 4 Feature Micro-Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Saint Coran</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium mt-1 leading-tight">
                60 Jukis synchronisés
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Mic className="w-4 h-4" />
                <span>Répétitions</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium mt-1 leading-tight">
                Chants & Audios live
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Users className="w-4 h-4" />
                <span>Membres</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium mt-1 leading-tight">
                Annuaire & Kourels
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Calendar className="w-4 h-4" />
                <span>Pointage</span>
              </div>
              <p className="text-[11px] text-emerald-100/80 font-medium mt-1 leading-tight">
                Présences & Absences
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('repetition')}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 group active:scale-95 cursor-pointer border border-emerald-500/40"
            >
              <Mic className="w-4 h-4 text-emerald-200" />
              <span>Gérer les Répétitions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('kamil')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Suivi Kamil Coran ({totalJukisLus}/60)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern KPI Stats Cards (2x2 sur mobile, 4 colonnes sur grand écran) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total Membres */}
        <div
          onClick={() => setActiveTab('membres')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-emerald-200/60 shadow-soft-xs flex-shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-emerald-800 bg-emerald-100/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
              <span>{totalMembresActifs} Actifs</span>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">{membres.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Membres</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Kourels / Répétitions */}
        <div
          onClick={() => setActiveTab('repetition')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-amber-200/60 shadow-soft-xs flex-shrink-0">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-amber-800 bg-amber-100/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              {kourels.length} Sections
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">{seances.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Séances rép.</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Cycle Kamil */}
        <div
          onClick={() => setActiveTab('kamil')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-blue-200/60 shadow-soft-xs flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-blue-800 bg-blue-100/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              {kamilCompletionPercent}% Lu
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">#{kamilCycle.numero_cycle}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">60 Jukis</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-colors flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Cotisations */}
        <div
          onClick={() => setActiveTab('membres')}
          className="pro-card p-3.5 sm:p-5 pro-card-hover cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform border border-purple-200/60 shadow-soft-xs flex-shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-purple-800 bg-purple-100/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              {Math.round((totalCotisationsEnRegle / (membres.length || 1)) * 100)}%
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">{totalCotisationsEnRegle}/{membres.length}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5 flex items-center justify-between">
              <span className="truncate">Cotisations</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-colors flex-shrink-0" />
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
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${s.statut === 'Terminée'
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

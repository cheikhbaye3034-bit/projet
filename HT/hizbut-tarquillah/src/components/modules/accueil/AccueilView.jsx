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
  Music, 
  CheckCircle2,
  Bell,
  Heart
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import bgHero from '../../../assets/images/bg_hero.jpg';

export const AccueilView = () => {
  const { membres, kourels, kamilCycle, seances, informations, setActiveTab } = useApp();

  const totalMembresActifs = membres.filter(m => m.statut === 'Actif').length;
  const totalCotisationsEnRegle = membres.filter(m => m.cotisation_statut === 'À jour').length;
  const recentSeances = seances.slice(0, 3);
  const pinnedInfo = informations.find(i => i.epingle) || informations[0];

  return (
    <div className="space-y-8 pb-10 animate-fade-in select-none">
      {/* Hero Banner with Background Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ht-line">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${bgHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ht-ink/95 via-ht-ink/80 to-ht-emerald/40 backdrop-blur-[2px]" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-ht-mint">
            <Sparkles className="w-4 h-4 text-ht-amber animate-pulse" />
            <span>Plateforme Officielle — Hizbut-Tarqiyyah</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight drop-shadow-md">
            Bienvenue sur la Gestion Spirituelle & Organisationnelle
          </h1>

          <p className="text-sm sm:text-base text-gray-200 font-normal leading-relaxed max-w-2xl">
            Suivi des répétitions de Khassida, coordination des cycles de Kamil collectif, gestion de l'assiduité et des cotisations des membres au service de la Khadimiya.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('repetition')}
              className="px-6 py-3 bg-ht-emerald hover:bg-ht-fern text-white font-display font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
            >
              <Mic className="w-4 h-4" />
              <span>Voir les Répétitions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('kamil')}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-display font-semibold text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-ht-amber" />
              <span>Suivi Kamil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Membres */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="bg-white rounded-3xl p-5 border border-ht-line shadow-soft hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold group-hover:scale-110 transition-transform border border-ht-mint">
              <Users className="w-6 h-6 text-ht-emerald" />
            </div>
            <span className="text-[11px] font-bold text-ht-emerald bg-ht-mist px-2.5 py-1 rounded-full border border-ht-mint">
              {totalMembresActifs} Actifs
            </span>
          </div>
          <div className="font-display font-extrabold text-2xl text-ht-ink">{membres.length}</div>
          <div className="text-xs text-ht-sage font-medium mt-0.5">Membres enregistrés</div>
        </div>

        {/* Kourels */}
        <div 
          onClick={() => setActiveTab('repetition')}
          className="bg-white rounded-3xl p-5 border border-ht-line shadow-soft hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-ht-amber flex items-center justify-center font-bold group-hover:scale-110 transition-transform border border-amber-200">
              <Mic className="w-6 h-6 text-ht-amber" />
            </div>
            <span className="text-[11px] font-bold text-ht-amber bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {kourels.length} Kourels
            </span>
          </div>
          <div className="font-display font-extrabold text-2xl text-ht-ink">{seances.length}</div>
          <div className="text-xs text-ht-sage font-medium mt-0.5">Séances planifiées</div>
        </div>

        {/* Cycle Kamil */}
        <div 
          onClick={() => setActiveTab('kamil')}
          className="bg-white rounded-3xl p-5 border border-ht-line shadow-soft hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform border border-blue-200">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              30 Juz'
            </span>
          </div>
          <div className="font-display font-extrabold text-2xl text-ht-ink">Cycle #{kamilCycle.numero_cycle}</div>
          <div className="text-xs text-ht-sage font-medium mt-0.5">Lecture du Coran en cours</div>
        </div>

        {/* Cotisations */}
        <div 
          onClick={() => setActiveTab('membres')}
          className="bg-white rounded-3xl p-5 border border-ht-line shadow-soft hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform border border-emerald-200">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {Math.round((totalCotisationsEnRegle / membres.length) * 100)}% En règle
            </span>
          </div>
          <div className="font-display font-extrabold text-2xl text-ht-ink">{totalCotisationsEnRegle} / {membres.length}</div>
          <div className="text-xs text-ht-sage font-medium mt-0.5">Membres à jour des cotisations</div>
        </div>
      </div>

      {/* Main Grid: Kourels Overview & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Kourels & Organization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Kourels Showcase */}
          <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-ht-ink">
                  Kourels de l'Association
                </h3>
                <p className="text-xs text-ht-sage mt-0.5">Sections de récitation et d'apprentissage</p>
              </div>
              <button 
                onClick={() => setActiveTab('repetition')}
                className="text-xs font-semibold text-ht-emerald hover:underline flex items-center gap-1"
              >
                <span>Accéder aux répétitions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kourels.map((k) => {
                const countMembers = membres.filter(m => m.kourel_id === k.id).length;
                return (
                  <div 
                    key={k.id}
                    onClick={() => setActiveTab('repetition')}
                    className="p-4 bg-ht-page hover:bg-ht-mist/70 rounded-2xl border border-ht-line hover:border-ht-mint transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-ht-ink group-hover:text-ht-emerald transition-colors">
                        {k.nom.split('—')[1] || k.nom}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ht-mist text-ht-emerald border border-ht-mint">
                        {countMembers} membre(s)
                      </span>
                    </div>
                    <p className="text-xs text-ht-inkSoft line-clamp-2 leading-relaxed">
                      {k.description}
                    </p>
                    <div className="text-[11px] text-ht-sage font-medium pt-1 border-t border-ht-line/60 flex items-center justify-between">
                      <span>Resp : {k.superviseurs[0]}</span>
                      <span className="text-ht-emerald font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        <span>Voir</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kamil Cycle Progress Widget */}
          <div className="bg-gradient-to-br from-ht-ink to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-ht-amber" />
                <h3 className="font-display font-bold text-base">Suivi Kamil Collectif #{kamilCycle.numero_cycle}</h3>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-ht-mint border border-white/20">
                {kamilCycle.statut}
              </span>
            </div>

            <p className="text-xs text-gray-300">
              Lecture intégrale du Saint Coran répartie en 30 Juz' individuellement attribués aux membres.
            </p>

            {/* Progress bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-300">Progression globale du cycle</span>
                <span className="text-ht-amber">
                  {kamilCycle.assignations.filter(a => a.statut === 'Terminé').length} / 30 Juz' complétés
                </span>
              </div>
              <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-ht-emerald to-ht-mint rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((kamilCycle.assignations.filter(a => a.statut === 'Terminé').length / 30) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('kamil')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
              >
                <span>Accéder au Tableau Kamil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pinned Announcement & Upcoming Sessions */}
        <div className="space-y-6">
          {/* Pinned Info Card */}
          {pinnedInfo && (
            <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ht-amber uppercase tracking-wider">
                <Bell className="w-4 h-4 text-ht-amber" />
                <span>Annonce Principale</span>
              </div>
              <h4 className="font-display font-bold text-base text-ht-ink leading-snug">
                {pinnedInfo.titre}
              </h4>
              <p className="text-xs text-ht-inkSoft leading-relaxed line-clamp-4">
                {pinnedInfo.contenu}
              </p>
              <div className="pt-2 border-t border-ht-line flex items-center justify-between text-[11px] text-ht-sage font-medium">
                <span>Publié le {pinnedInfo.date_publication}</span>
                <button 
                  onClick={() => setActiveTab('info')}
                  className="text-ht-emerald font-semibold hover:underline"
                >
                  Lire la suite
                </button>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-ht-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ht-emerald" />
                <span>Répétitions Récentes</span>
              </h4>
              <button 
                onClick={() => setActiveTab('repetition')}
                className="text-xs text-ht-emerald font-semibold hover:underline"
              >
                Toutes
              </button>
            </div>

            <div className="space-y-3">
              {recentSeances.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setActiveTab('repetition')}
                  className="p-3.5 bg-ht-page hover:bg-ht-mist/50 rounded-2xl border border-ht-line transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-ht-ink">Séance du {s.date}</div>
                    <div className="text-[11px] text-ht-sage">{s.heure_debut} - {s.heure_fin} • {s.superviseur}</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    s.statut === 'Terminée' ? 'bg-ht-mist text-ht-emerald' : 'bg-amber-50 text-ht-amber'
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

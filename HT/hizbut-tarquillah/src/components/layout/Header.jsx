import React, { useState } from 'react';
import { Bell, Calendar, PlusCircle, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const Header = ({ onOpenMobileMenu }) => {
  const { activeTab, setActiveTab, currentUser, setCurrentUser, informations, appSettings } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const titles = {
    accueil:    { title: 'Vue d\'Ensemble',               subtitle: 'Bienvenue sur la plateforme Sama daara' },
    dashboard:  { title: 'Tableau de Bord',               subtitle: 'Statistiques analytiques et indicateurs clés' },
    membres:    { title: 'Annuaire des Membres',          subtitle: 'Répertoire complet, assiduité et affectations' },
    repetition: { title: 'Répétition & Pointage',        subtitle: 'Séances, feuilles d\'émargement et historique' },
    kamil:      { title: 'Suivi Kamil Coran',             subtitle: 'Lecture intégrale du Saint Coran (60 Jukis)' },
    info:       { title: 'Informations & Annonces',       subtitle: 'Communications officielles du Daara' },
    reglages:   { title: 'Réglages & Configuration',      subtitle: 'Administration — Responsables uniquement' },
  };

  const currentInfo = titles[activeTab] || titles.accueil;
  const daaraName   = appSettings?.daaraName || 'Sama daara';

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const pinnedCount = informations ? informations.filter(i => i.epingle).length : 0;

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-ht-line sticky top-0 z-[90] shadow-[0_2px_16px_-4px_rgba(16,91,60,0.06)]">

      {/* ── MOBILE SEARCH OVERLAY ──────────────────────────────────────────── */}
      {showSearch && (
        <div className="lg:hidden px-4 py-3 flex items-center gap-2 border-b border-slate-100 bg-white animate-fade-in">
          <Search className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher un membre, séance, juki..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <button onClick={() => setShowSearch(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── MAIN HEADER ROW ────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">

        {/* LEFT: Logo (mobile) + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo visible only on mobile */}
          <div className="lg:hidden flex-shrink-0 w-11 h-11 flex items-center justify-center">
            <img src={logoImg} alt="Logo" className="w-full h-full object-contain filter drop-shadow-xs" />
          </div>

          <div className="min-w-0">
            <h2 className="font-display font-black text-base sm:text-lg text-ht-ink tracking-tight leading-tight truncate">
              {currentInfo.title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5 truncate">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">

          {/* Search — full bar on desktop, icon toggle on mobile */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/90 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 transition-all font-medium"
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowSearch(v => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
            aria-label="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Date — only on xl */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span className="capitalize">{formattedDate}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl text-slate-700 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pinnedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {pinnedCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[min(320px,90vw)] bg-white rounded-2xl border border-slate-200 shadow-2xl z-[100] p-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-display font-bold text-xs text-slate-900">Annonces & Notifications</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {pinnedCount} épinglée{pinnedCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                  {informations && informations.slice(0, 3).map((info, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 transition-colors cursor-pointer"
                      onClick={() => { setActiveTab('info'); setShowNotifications(false); }}
                    >
                      <div className="font-bold text-xs text-slate-900 truncate">{info.titre}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{info.contenu}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setActiveTab('info'); setShowNotifications(false); }}
                  className="w-full mt-2 pt-2 border-t border-slate-100 text-center text-xs text-emerald-800 font-bold hover:underline"
                >
                  Voir toutes les informations →
                </button>
              </div>
            )}
          </div>

          {/* Button to Switch to Member Portal */}
          <button
            onClick={() => {
              setCurrentUser(prev => ({
                ...prev,
                role: 'Membre',
                // Keep the responsable's actual identity and administrative access flag
                hasResponsableAccess: true
              }));
              setActiveTab('accueil');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
            title="Accéder à mon espace membre personnel"
          >
            <span className="hidden sm:inline">Espace Membre</span>
            <span className="sm:hidden">Membre</span>
          </button>

          {/* Quick Pointage — hidden on small mobile */}
          <button
            onClick={() => setActiveTab('repetition')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden md:inline">Pointage Rapide</span>
            <span className="md:hidden">Pointer</span>
          </button>
        </div>
      </div>
    </header>
  );
};

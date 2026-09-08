import React from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Mic,
  BookOpen,
  Newspaper,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Activity,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser, logout, membres, seances, kamilCycle, appSettings } = useApp();

  const isResponsable = currentUser?.role !== 'Membre';
  const activeJukisCount = (kamilCycle?.assignations || []).filter(j => j.statut === 'Terminé' || j.statut === 'Validé' || j.statut === 'En cours').length;

  const navItems = [
    { id: 'accueil', label: 'Vue d\'ensemble', icon: Home, badge: null },
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, badge: null },
    { id: 'membres', label: 'Membres & Dahira', icon: Users, badge: membres?.length },
    { id: 'repetition', label: 'Répétition & Pointage', icon: Mic, badge: 'Live' },
    { id: 'kamil', label: 'Suivi Kamil Coran', icon: BookOpen, badge: `${activeJukisCount}/30` },
    { id: 'info', label: 'Informations', icon: Newspaper, badge: null },
    ...(isResponsable ? [{ id: 'reglages', label: 'Réglages', icon: Settings, badge: null }] : []),
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-ht-line min-h-screen sticky top-0 z-30 select-none shadow-[4px_0_24px_-4px_rgba(16,91,60,0.03)]">
      {/* Brand Header — Ultra Professional & Full Circle Logo */}
      <div className="p-5 border-b border-emerald-900/10 flex items-center gap-3.5 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/30">
        {/* Logo Container — Agrandie & Fondue avec le blanc */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center flex-shrink-0 relative group transition-transform duration-300 hover:scale-105">
          <img 
            src={logoImg} 
            alt="Sama daara" 
            className="w-full h-full object-contain filter drop-shadow-xs" 
          />
        </div>

        {/* Stylish Typography */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-black text-lg sm:text-[19px] tracking-wide text-slate-900 truncate drop-shadow-xs">
              {appSettings?.daaraName || 'Sama daara'}
            </h1>
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md shadow-xs uppercase border border-amber-400/40 flex-shrink-0">
              PRO
            </span>
          </div>

          <p className="font-serif italic text-xs font-semibold text-emerald-800 tracking-wide flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300 animate-pulse flex-shrink-0"></span>
            <span>Portail de Gestion</span>
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-black text-ht-inkMuted uppercase tracking-wider flex items-center justify-between">
          <span>Plateforme</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-800 text-white font-bold shadow-soft-lg shadow-emerald-900/15 translate-x-1'
                  : 'text-ht-inkSoft hover:bg-emerald-50/60 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'bg-slate-100/80 text-slate-500 group-hover:bg-emerald-100/60 group-hover:text-emerald-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="tracking-tight">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.badge === 'Live'
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-emerald-100/70 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Daara System Status Banner */}
      <div className="mx-3.5 my-2 p-3 bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-amber-50/40 rounded-xl border border-emerald-200/60 text-xs shadow-soft-xs">
        <div className="flex items-center justify-between text-emerald-950 font-bold text-[11px] mb-1">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Statut Daara
          </span>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-white px-2 py-0.5 rounded-full border border-emerald-200">En direct</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-snug">
          Plateforme opérationnelle • Synchronisation active
        </p>
      </div>

      {/* User Profile Bar */}
      <div className="p-3.5 border-t border-ht-line bg-slate-50/80">
        <div className="p-2.5 bg-white rounded-xl border border-ht-line flex items-center justify-between shadow-soft-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-soft-xs flex-shrink-0">
              {currentUser?.nom ? currentUser.nom.substring(0, 2).toUpperCase() : 'SK'}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-ht-ink truncate">
                {currentUser?.nom || 'Serigne Modou Kara'}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="truncate">{currentUser?.role || 'Superviseur'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

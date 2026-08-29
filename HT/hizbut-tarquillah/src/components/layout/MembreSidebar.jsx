import React from 'react';
import {
  Home,
  Mic,
  BookOpen,
  Newspaper,
  CreditCard,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const MembreSidebar = ({ activeMemberTab, setActiveMemberTab }) => {
  const { currentUser, logout, seances, kamilCycle, informations } = useApp();

  const myAssignedCount = kamilCycle?.assignations?.filter(a => a.membre_id === currentUser?.id).length || 1;

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, badge: null },
    { id: 'repetition', label: 'Mes Répétitions', icon: Mic, badge: 'Séance' },
    { id: 'kamil', label: 'Mon Kamil (Coran)', icon: BookOpen, badge: `${myAssignedCount} Juki` },
    { id: 'info', label: 'Actualités & Fil', icon: Newspaper, badge: null },
    { id: 'profil', label: 'Mon Profil & Carte', icon: User, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-ht-line min-h-screen sticky top-0 z-30 select-none shadow-[4px_0_24px_-4px_rgba(16,91,60,0.03)]">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-ht-line/80 flex items-center gap-3.5 bg-gradient-to-r from-emerald-50/50 via-white to-white">
        <div className="w-11 h-11 rounded-2xl bg-white border border-emerald-200/80 p-1.5 flex items-center justify-center shadow-soft overflow-hidden flex-shrink-0 relative group">
          <img src={logoImg} alt="Hizbut Tarquillah Logo" className="w-full h-full object-contain transform group-hover:scale-105 transition-transform" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-display font-black text-sm text-ht-ink tracking-tight">
              Hizbut-Tarqiyyah
            </h1>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">MEMBRE</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Espace Personnel
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-black text-ht-inkMuted uppercase tracking-wider flex items-center justify-between">
          <span>Menu Membre</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMemberTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveMemberTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group cursor-pointer ${
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
                      : 'bg-emerald-100/80 text-emerald-800'
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

      {/* User Footer Profile */}
      <div className="p-3.5 border-t border-ht-line/80 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-soft-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {currentUser?.prenom?.[0] || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {currentUser?.matricule || 'HT-2026-0142'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};

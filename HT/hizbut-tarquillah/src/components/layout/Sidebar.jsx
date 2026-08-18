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
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const Sidebar = () => {
  const { activeTab, setActiveTab, currentUser, logout } = useApp();

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'membres', label: 'Membres', icon: Users },
    { id: 'repetition', label: 'Répétition', icon: Mic },
    { id: 'kamil', label: 'Suivi Kamil', icon: BookOpen },
    { id: 'info', label: 'Informations', icon: Newspaper },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-ht-line min-h-screen sticky top-0 z-30 select-none">
      {/* Brand Header with New Official Logo */}
      <div className="p-6 border-b border-ht-line flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-white border border-ht-mint p-1 flex items-center justify-center shadow-soft overflow-hidden flex-shrink-0">
          <img src={logoImg} alt="Hizbut Tarquillah Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-display font-extrabold text-base text-ht-ink leading-tight">
            Daara Hizbut-Tarqiyyah
          </h1>
          <p className="text-[11px] text-ht-emerald font-bold">Gestion de la Daara</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-ht-sage uppercase tracking-wider">
          Menu Principal
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`btn-anim w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-ht-mist text-ht-emerald border border-ht-mint font-bold shadow-xs'
                  : 'text-ht-inkSoft hover:bg-ht-page hover:text-ht-ink'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-ht-emerald' : 'text-ht-sage'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-ht-emerald" />}
            </button>
          );
        })}
      </nav>

      {/* User Profile Bar */}
      <div className="p-4 border-t border-ht-line bg-ht-page/80">
        <div className="p-3 bg-white rounded-2xl border border-ht-line flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-emerald text-white font-bold flex items-center justify-center text-xs shadow-xs">
              SK
            </div>
            <div>
              <div className="font-bold text-xs text-ht-ink truncate max-w-[120px]">
                {currentUser?.nom || 'Serigne Modou Kara'}
              </div>
              <div className="text-[10px] text-ht-emerald font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{currentUser?.role || 'Super Admin'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-ht-sage hover:text-ht-clay hover:bg-rose-50 rounded-xl transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

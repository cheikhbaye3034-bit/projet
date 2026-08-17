import React from 'react';
import {
  Home,
  LayoutDashboard,
  Users,
  Mic,
  BookOpen,
  Newspaper,
  X,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, logout } = useApp();

  if (!isOpen) return null;

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'membres', label: 'Membres', icon: Users },
    { id: 'repetition', label: 'Répétition', icon: Mic },
    { id: 'kamil', label: 'Suivi Kamil', icon: BookOpen },
    { id: 'info', label: 'Informations', icon: Newspaper },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ht-ink/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-ht-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center text-white font-display font-extrabold text-lg">
              HT
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-ht-ink">Hizbut-Tarqiyyah</h1>
              <p className="text-[11px] text-ht-inkSoft">Association Religieuse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ht-sage hover:bg-ht-page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-ht-mist text-ht-emerald font-semibold border border-ht-mint'
                    : 'text-ht-inkSoft hover:bg-ht-page'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-ht-emerald' : 'text-ht-sage'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-ht-line bg-ht-page/50">
          <div className="p-3 bg-white rounded-xl border border-ht-line flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-ht-mint text-ht-emerald flex items-center justify-center font-bold text-xs">
                {currentUser.prenom[0]}{currentUser.nom[0]}
              </div>
              <div className="truncate">
                <div className="font-semibold text-xs text-ht-ink truncate">
                  {currentUser.prenom} {currentUser.nom}
                </div>
                <div className="text-[10px] text-ht-emerald flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser.role}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-1.5 text-ht-sage hover:text-ht-clay rounded-lg"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

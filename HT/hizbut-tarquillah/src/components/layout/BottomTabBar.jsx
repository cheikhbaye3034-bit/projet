import React, { useState } from 'react';
import {
  Home,
  Users,
  Mic,
  BookOpen,
  MoreHorizontal,
  Newspaper,
  Settings,
  X,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

// The "More" bottom sheet listing secondary navigation items
const MoreSheet = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, logout } = useApp();
  const isResponsable = currentUser?.role !== 'Membre';

  const moreItems = [
    { id: 'info',      label: 'Informations & Annonces', icon: Newspaper },
    { id: 'dashboard', label: 'Tableau de bord',          icon: LayoutDashboard },
    ...(isResponsable ? [{ id: 'reglages', label: 'Réglages & Config.', icon: Settings }] : []),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end lg:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/15 backdrop-blur-xs"
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-[2rem] shadow-2xl z-10 overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* User Card */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
              {currentUser?.prenom?.[0] || 'S'}{currentUser?.nom?.[0] || 'K'}
            </div>
            <div>
              <div className="font-display font-black text-sm text-slate-900">
                {currentUser?.prenom} {currentUser?.nom}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-0.5">
                {isResponsable ? <Crown className="w-3 h-3 text-amber-500" /> : <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                <span>{currentUser?.role || 'Responsable'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* More nav items */}
        <nav className="px-4 py-3 space-y-1.5">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); onClose(); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/15' : 'bg-slate-100'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-800'}`} />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-4 pt-1">
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-600 hover:bg-rose-50 active:bg-rose-100 font-bold text-sm transition-all"
          >
            <div className="p-2 rounded-xl bg-rose-50">
              <LogOut className="w-4 h-4 text-rose-500" />
            </div>
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Safe area spacer for iOS */}
        <div className="h-safe-area-inset-bottom" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </div>
  );
};

// Main Bottom Tab Bar
export const BottomTabBar = () => {
  const { activeTab, setActiveTab, membres } = useApp();
  const [showMore, setShowMore] = useState(false);

  const primaryTabs = [
    { id: 'accueil',    label: 'Accueil',    icon: Home     },
    { id: 'membres',   label: 'Membres',    icon: Users,   badge: membres?.length },
    { id: 'repetition',label: 'Pointage',   icon: Mic,     badge: 'LIVE' },
    { id: 'kamil',     label: 'Kamil',      icon: BookOpen },
    { id: 'more',      label: 'Plus',       icon: MoreHorizontal },
  ];

  const moreActiveIds = ['info', 'dashboard', 'reglages'];
  const isMoreActive  = moreActiveIds.includes(activeTab) || showMore;

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-[150] lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)] flex items-center justify-around px-1"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: '60px' }}
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isMore = tab.id === 'more';
          const isActive = isMore ? isMoreActive : activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (isMore) {
                  setShowMore(true);
                } else {
                  setActiveTab(tab.id);
                  setShowMore(false);
                }
              }}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 min-h-[52px] active:scale-95 transition-transform"
              aria-label={tab.label}
            >
              {/* Active Indicator Pill */}
              {isActive && (
                <span className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-emerald-700" />
              )}

              {/* Icon container */}
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-2xl transition-all ${
                isActive ? 'bg-emerald-100' : ''
              }`}>
                <Icon className={`w-[19px] h-[19px] transition-colors ${
                  isActive ? 'text-emerald-800' : 'text-slate-400'
                }`} />

                {/* Badge */}
                {tab.badge && !isActive && (
                  <span className={`absolute -top-1 -right-1.5 text-[9px] font-black px-1.5 py-0 rounded-full leading-4 ${
                    tab.badge === 'LIVE'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-700 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-bold leading-none transition-colors ${
                isActive ? 'text-emerald-800' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* More Sheet */}
      <MoreSheet isOpen={showMore} onClose={() => setShowMore(false)} />
    </>
  );
};

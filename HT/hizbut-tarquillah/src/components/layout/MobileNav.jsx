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
  ShieldCheck,
  ChevronRight,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const MobileNav = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, logout, membres, kamilCycle, appSettings } = useApp();

  const isResponsable = currentUser?.role !== 'Membre';
  const activeJukisCount = (kamilCycle?.assignations || []).filter(j => j.statut === 'Terminé' || j.statut === 'Validé' || j.statut === 'En cours').length;

  const navItems = [
    { id: 'accueil', label: 'Vue d\'ensemble', icon: Home },
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'membres', label: 'Membres', icon: Users, badge: membres?.length },
    { id: 'repetition', label: 'Répétitions', icon: Mic, badge: 'Live' },
    { id: 'kamil', label: 'Kamil', icon: BookOpen, badge: `${activeJukisCount}/30` },
    { id: 'info', label: 'Informations', icon: Newspaper },
    ...(isResponsable ? [{ id: 'reglages', label: 'Réglages', icon: Settings }] : []),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] lg:hidden flex animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b border-emerald-950/40 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif font-black text-base text-white tracking-wide truncate max-w-[130px]">
                  {appSettings?.daaraName || 'Sama daara'}
                </h1>
                <span className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">PRO</span>
              </div>
              <p className="font-serif italic text-[11px] text-emerald-200/90 font-medium">Portail de Gestion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-soft-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-ht-line bg-slate-50">
          <div className="p-3 bg-white rounded-xl border border-ht-line flex items-center justify-between shadow-soft-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.prenom?.[0] || 'S'}{currentUser?.nom?.[0] || 'K'}
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-slate-900 truncate">
                  {currentUser?.prenom} {currentUser?.nom}
                </div>
                <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{currentUser?.role || 'Superviseur'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

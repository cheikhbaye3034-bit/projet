import React from 'react';
import { 
  X, 
  Home, 
  Mic, 
  BookOpen, 
  Newspaper, 
  CreditCard, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/logo.png';

export const MembreMobileNav = ({ isOpen, onClose, activeMemberTab, setActiveMemberTab }) => {
  const { currentUser, logout } = useApp();

  if (!isOpen) return null;

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'repetition', label: 'Mes Répétitions', icon: Mic },
    { id: 'kamil', label: 'Mon Kamil (Coran)', icon: BookOpen },
    { id: 'info', label: 'Actualités & Fil', icon: Newspaper },
    { id: 'profil', label: 'Mon Profil & Carte', icon: User },
  ];

  const handleNavClick = (tabId) => {
    setActiveMemberTab(tabId);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-[500] lg:hidden animate-fade-in select-none">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-right">
        
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 p-1 flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-slate-900">
                  Hizbut-Tarqiyyah
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                  PORTAIL MEMBRE
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMemberTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                {currentUser?.matricule || 'HT-2026-0142'}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

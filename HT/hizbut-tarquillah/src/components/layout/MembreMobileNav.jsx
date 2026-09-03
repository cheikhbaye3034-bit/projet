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
  const { currentUser, logout, appSettings } = useApp();

  const navItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'repetition', label: 'Répétitions & Khassidas', icon: Mic },
    { id: 'kamil', label: 'Suivi Kamil (Coran)', icon: BookOpen },
    { id: 'info', label: 'Informations & Actualités', icon: Newspaper },
    { id: 'profil', label: 'Mon Profil & Carte', icon: User },
  ];

  if (!isOpen) return null;

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
          <div className="p-4 border-b border-emerald-900/10 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-600/40 ring-2 ring-emerald-500/10 flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                <img src={logoImg} alt="Logo" className="w-full h-full object-cover scale-[1.75]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-black text-base text-slate-900 truncate max-w-[130px]">
                    {appSettings?.daaraName || 'Sama daara'}
                  </h3>
                  <span className="text-[8px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded uppercase">
                    MEMBRE
                  </span>
                </div>
                <p className="font-serif italic text-[11px] text-emerald-800 font-medium">Espace Personnel</p>
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

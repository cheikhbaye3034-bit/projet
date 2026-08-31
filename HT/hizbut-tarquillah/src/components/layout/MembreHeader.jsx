import React from 'react';
import { 
  Menu, 
  LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MembreHeader = ({ onOpenMobileMenu, activeMemberTab, setActiveMemberTab }) => {
  const { logout, setCurrentUser, appSettings } = useApp();

  const getPageTitle = () => {
    switch (activeMemberTab) {
      case 'accueil': return 'Espace Membre';
      case 'repetition': return 'Répétitions & Khassidas';
      case 'kamil': return 'Suivi Kamil (Coran)';
      case 'info': return 'Actualités & Annonces';
      case 'profil': return 'Mon Profil & Carte';
      default: return 'Portail Membre';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
            {getPageTitle()}
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
            {appSettings?.daaraName || 'Sama daara'} • Portail Numérique des Membres
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => {
            setCurrentUser(prev => ({
              ...prev,
              role: 'Super Admin',
              nom: 'Kara',
              prenom: 'Serigne Modou'
            }));
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
          title="Basculer vers l'Espace Responsable"
        >
          <span>Espace Responsable</span>
        </button>

        {/* Logout icon */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          title="Se déconnecter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};


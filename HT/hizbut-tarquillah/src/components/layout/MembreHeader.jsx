import React from 'react';
import { 
  Menu, 
  LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MembreHeader = ({ onOpenMobileMenu, activeMemberTab, setActiveMemberTab }) => {
  const { logout, setCurrentUser } = useApp();

  const getPageTitle = () => {
    switch (activeMemberTab) {
      case 'accueil': return 'Accueil Membre';
      case 'repetition': return 'Répétitions & Khassidas';
      case 'kamil': return 'Récitation du Saint Coran (Kamil)';
      case 'info': return 'Fil des Actualités';
      case 'profil': return 'Mon Profil & Carte Dahira';
      default: return 'Espace Membre';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-ht-line/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(16,91,60,0.03)] select-none">
      
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-display font-black text-base sm:text-lg text-slate-900 leading-tight">
            {getPageTitle()}
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
            Hizbut-Tarqiyyah • Portail Numérique des Membres
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


import React, { useState } from 'react';
import { Search, Bell, Calendar, User, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = ({ onOpenMobileMenu }) => {
  const { activeTab, currentUser, informations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const titles = {
    dashboard: { title: 'Tableau de bord', subtitle: 'Vue d’ensemble des activités et indicateurs clés' },
    membres: { title: 'Annuaire des Membres', subtitle: 'Gestion et suivi de tous les membres de l’association' },
    repetition: { title: 'Séances de Répétition', subtitle: 'Gestion des programmes de répétition & pointage' },
    kamil: { title: 'Suivi Collectif du Kamil', subtitle: 'Lecture intégrale du Saint Coran (30 Juz’)' },
    info: { title: 'Informations & Actualités', subtitle: 'Espace de communication et annonces officielles' },
  };

  const currentInfo = titles[activeTab] || titles.dashboard;

  const formattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const pinnedCount = informations.filter(i => i.epingle).length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-ht-line sticky top-0 z-20 px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
      {/* Left Title & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-ht-inkSoft hover:bg-ht-mist border border-ht-line"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display font-bold text-xl text-ht-ink">
            {currentInfo.title}
          </h2>
          <p className="text-xs text-ht-inkSoft hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-ht-sage absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher membre, séance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink placeholder:text-ht-sage focus:outline-none focus:border-ht-fern focus:ring-1 focus:ring-ht-fern transition-all"
          />
        </div>

        {/* Date Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-inkSoft font-medium">
          <Calendar className="w-4 h-4 text-ht-emerald" />
          <span className="capitalize">{formattedDate}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 bg-ht-page hover:bg-ht-mist border border-ht-line rounded-xl text-ht-inkSoft transition-colors relative">
            <Bell className="w-5 h-5" />
            {pinnedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-ht-amber text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {pinnedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

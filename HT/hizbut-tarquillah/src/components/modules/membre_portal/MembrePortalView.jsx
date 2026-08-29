import React, { useState } from 'react';
import { MembreSidebar } from '../../layout/MembreSidebar';
import { MembreHeader } from '../../layout/MembreHeader';
import { MembreMobileNav } from '../../layout/MembreMobileNav';
import { MembreAccueilTab } from './MembreAccueilTab';
import { MembreRepetitionTab } from './MembreRepetitionTab';
import { MembreKamilTab } from './MembreKamilTab';
import { MembreInfoTab } from './MembreInfoTab';
import { MembreProfilTab } from './MembreProfilTab';
import { Home, Mic, BookOpen, Newspaper, User } from 'lucide-react';

export const MembrePortalView = () => {
  const [activeMemberTab, setActiveMemberTab] = useState('accueil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'repetition', label: 'Répétitions', icon: Mic },
    { id: 'kamil', label: 'Kamil', icon: BookOpen },
    { id: 'info', label: 'Actualités', icon: Newspaper },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F6FAF7] flex flex-col lg:flex-row antialiased text-slate-800 font-sans">
      
      {/* Desktop Sidebar Dedicated to Member */}
      <MembreSidebar 
        activeMemberTab={activeMemberTab}
        setActiveMemberTab={setActiveMemberTab}
      />

      {/* Mobile Drawer Navigation */}
      <MembreMobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeMemberTab={activeMemberTab}
        setActiveMemberTab={setActiveMemberTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        
        {/* Header */}
        <MembreHeader 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          activeMemberTab={activeMemberTab}
          setActiveMemberTab={setActiveMemberTab}
        />

        {/* Dynamic Tab Body — Mobile Optimized & Centered */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          {activeMemberTab === 'accueil' && (
            <MembreAccueilTab onNavigateTab={(tab) => setActiveMemberTab(tab)} />
          )}
          {activeMemberTab === 'repetition' && (
            <MembreRepetitionTab />
          )}
          {activeMemberTab === 'kamil' && (
            <MembreKamilTab />
          )}
          {activeMemberTab === 'info' && (
            <MembreInfoTab />
          )}
          {activeMemberTab === 'profil' && (
            <MembreProfilTab />
          )}
        </main>

        {/* =========================================================================
            MOBILE BOTTOM NAVIGATION BAR (NATIVE APP STYLE)
            Optimized for touch targets (min 48px), safe area insets & smooth feedback
        ========================================================================= */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-2 flex items-center justify-around z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMemberTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMemberTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[52px] min-h-[46px] transition-all duration-200 active:scale-90 cursor-pointer ${
                  isActive 
                    ? 'text-emerald-900 font-extrabold' 
                    : 'text-slate-400 hover:text-slate-600 font-semibold'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100 text-emerald-900 shadow-xs' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight leading-none">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};

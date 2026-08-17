import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/ui/Toast';

import { LoginView } from './components/modules/auth/LoginView';
import { AccueilView } from './components/modules/accueil/AccueilView';
import { DashboardView } from './components/modules/dashboard/DashboardView';
import { MembresView } from './components/modules/membres/MembresView';
import { RepetitionView } from './components/modules/repetition/RepetitionView';
import { KamilView } from './components/modules/kamil/KamilView';
import { InfoView } from './components/modules/info/InfoView';

const MainLayout = () => {
  const { activeTab, isAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If user is not authenticated or explicitly on login screen
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <>
        <LoginView />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-ht-page flex flex-col lg:flex-row antialiased text-ht-ink">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'accueil' && <AccueilView />}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'membres' && <MembresView />}
          {activeTab === 'repetition' && <RepetitionView />}
          {activeTab === 'kamil' && <KamilView />}
          {activeTab === 'info' && <InfoView />}
        </main>
      </div>

      {/* Global Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

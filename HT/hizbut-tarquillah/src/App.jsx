import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomTabBar } from './components/layout/BottomTabBar';
import { Toast } from './components/ui/Toast';

import { LandingView } from './components/modules/auth/LandingView';
import { LoginView } from './components/modules/auth/LoginView';
import { AccueilView } from './components/modules/accueil/AccueilView';
import { DashboardView } from './components/modules/dashboard/DashboardView';
import { MembresView } from './components/modules/membres/MembresView';
import { RepetitionView } from './components/modules/repetition/RepetitionView';
import { KamilView } from './components/modules/kamil/KamilView';
import { InfoView } from './components/modules/info/InfoView';
import { MembrePortalView } from './components/modules/membre_portal/MembrePortalView';
import { ReglagesView } from './components/modules/reglages/ReglagesView';

const MainLayout = () => {
  const { activeTab, isAuthenticated, currentUser } = useApp();
  const [authScreen, setAuthScreen] = useState('landing'); // 'landing' | 'login'

  // If user is not authenticated or explicitly on login / landing screen
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <>
        {authScreen === 'landing' ? (
          <LandingView 
            onStartLogin={(mode = 'login') => setAuthScreen(mode === 'register' ? 'register' : 'login')}
            onStartRegister={() => setAuthScreen('register')}
          />
        ) : (
          <LoginView 
            initialMode={authScreen === 'register' ? 'register' : 'login'}
            onBack={() => setAuthScreen('landing')} 
          />
        )}
        <Toast />
      </>
    );
  }

  // 👤 DEDICATED MEMBER PORTAL VIEW (When user is logged in as 'Membre')
  if (currentUser?.role === 'Membre') {
    return (
      <>
        <MembrePortalView />
        <Toast />
      </>
    );
  }

  // 👑 SUPERVISOR & SUPER ADMIN MANAGEMENT LAYOUT
  return (
    <div className="min-h-screen bg-ht-page flex flex-col lg:flex-row antialiased text-ht-ink">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {activeTab === 'accueil' && <AccueilView />}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'membres' && <MembresView />}
          {activeTab === 'repetition' && <RepetitionView />}
          {activeTab === 'kamil' && <KamilView />}
          {activeTab === 'info' && <InfoView />}
          {activeTab === 'reglages' && <ReglagesView />}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (replaces old hamburger/drawer) */}
      <BottomTabBar />

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

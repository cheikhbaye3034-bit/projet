import React, { useState } from 'react';
import { 
  Menu, 
  LogOut,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MembreHeader = ({ onOpenMobileMenu, activeMemberTab, setActiveMemberTab }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    logout, 
    setActiveTab, 
    unlockResponsableAccess, 
    appSettings 
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleEspaceResponsableClick = () => {
    // Si l'utilisateur est déjà un responsable (a le privilège validé)
    if (currentUser?.hasResponsableAccess) {
      setCurrentUser(prev => ({
        ...prev,
        role: 'Super Admin'
      }));
      setActiveTab('dashboard');
    } else {
      // Pour un membre régulier, exiger le code d'accès de sécurité
      setErrorMessage('');
      setAccessCode('');
      setShowAuthModal(true);
    }
  };

  const handleVerifyCode = (e) => {
    e?.preventDefault();
    if (!accessCode.trim()) {
      setErrorMessage("Veuillez saisir le code d'accès responsable.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = unlockResponsableAccess(accessCode.trim());
      if (result.success) {
        setShowAuthModal(false);
        setAccessCode('');
      } else {
        setErrorMessage(result.message || "Code d'accès incorrect.");
      }
      setIsVerifying(false);
    }, 250);
  };

  return (
    <>
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
              {appSettings?.daaraName || 'Sama Kourel'} • Portail Numérique des Membres
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleEspaceResponsableClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Accéder à l'Espace Responsable"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
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

      {/* Modal de Code d'Accès Responsable */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-slate-900">
                  Accès Responsable
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Zone d'administration protégée
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              Pour accéder au tableau de bord et à la gestion de la Daara en tant que responsable, veuillez saisir votre <strong>code secret d'accès responsable</strong>.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Code d'accès responsable :
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Entrez le code secret..."
                    autoFocus
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700 transition-all text-slate-800 placeholder:text-slate-400 placeholder:font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="mt-2.5 flex items-start gap-2 text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !accessCode.trim()}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  {isVerifying ? (
                    <span>Vérification...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Déverrouiller</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};



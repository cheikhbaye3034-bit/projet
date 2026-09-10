import React, { useState } from 'react';
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  UserCheck, 
  User, 
  Users, 
  Phone, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  Award, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import logoOfficial from '../../../assets/images/logo_ht_official.png';
import audioQasidaMountakha from '../../../assets/audio/cheikh_mountakha_qasida.m4a';

export const LoginView = ({ onBack, initialMode = 'login' }) => {
  const { login, appSettings, membres, responsables } = useApp();
  
  // 'login' (Connexion directe pour compte existant) | 'register' (Création de compte multi-étapes)
  const [authMode, setAuthMode] = useState(initialMode || 'login');

  // Direct Login states (pour ceux qui ont déjà un compte)
  const [directIdentifier, setDirectIdentifier] = useState('');
  const [directPassword, setDirectPassword] = useState('');
  const [showDirectPassword, setShowDirectPassword] = useState(false);

  // Multi-step state: 1, 2, 3 (et 4 uniquement pour Membre)
  const [step, setStep] = useState(1);
  
  // Step 1: Role
  const [role, setRole] = useState('membre'); // 'membre' | 'responsable'
  
  // Step 2: Personal Identity & Contact
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  
  // Step 3: Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 4: Access Code Membre Daara (requis pour être affilié membre)
  const [codeAcces, setCodeAcces] = useState('');

  // UI & Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper pour mémoriser les comptes créés
  const saveUserLocally = (userData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('ht_registered_users') || '[]');
      const filtered = existing.filter(u => 
        (userData.email && u.email !== userData.email) ||
        (userData.telephone && u.telephone !== userData.telephone)
      );
      filtered.push(userData);
      localStorage.setItem('ht_registered_users', JSON.stringify(filtered));
    } catch (e) { }
  };

  // Connexion directe pour les personnes ayant déjà un compte
  const handleDirectLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const cleanId = directIdentifier.trim();
    if (!cleanId) {
      setErrorMessage('Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }
    if (!directPassword || directPassword.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanLower = cleanId.toLowerCase();
      const cleanPhone = cleanId.replace(/[^0-9+]/g, '');

      // 1. Chercher dans les comptes déjà enregistrés localement
      let localAccounts = [];
      try {
        localAccounts = JSON.parse(localStorage.getItem('ht_registered_users') || '[]');
      } catch (err) {}

      const foundLocal = localAccounts.find(u => 
        (u.email && u.email.toLowerCase() === cleanLower) ||
        (u.telephone && u.telephone.replace(/[^0-9+]/g, '') === cleanPhone)
      );

      if (foundLocal) {
        try {
          const audio = new Audio(audioQasidaMountakha);
          audio.volume = 0.9;
          audio.play().catch(() => {});
        } catch (e) {}

        login(cleanId, directPassword, foundLocal);
        return;
      }

      // 2. Chercher dans les responsables de la plateforme
      const foundResp = (responsables || []).find(r => 
        (r.email && r.email.toLowerCase() === cleanLower) ||
        (r.telephone && r.telephone.replace(/[^0-9+]/g, '') === cleanPhone)
      );

      if (foundResp) {
        try {
          const audio = new Audio(audioQasidaMountakha);
          audio.volume = 0.9;
          audio.play().catch(() => {});
        } catch (e) {}

        login(cleanId, directPassword, {
          ...foundResp,
          role: 'Super Admin',
          hasResponsableAccess: true
        });
        return;
      }

      // 3. Chercher dans les membres de la Daara
      const foundMembre = (membres || []).find(m => 
        (m.email && m.email.toLowerCase() === cleanLower) ||
        (m.telephone && m.telephone.replace(/[^0-9+]/g, '') === cleanPhone)
      );

      if (foundMembre) {
        try {
          const audio = new Audio(audioQasidaMountakha);
          audio.volume = 0.9;
          audio.play().catch(() => {});
        } catch (e) {}

        login(cleanId, directPassword, {
          ...foundMembre,
          role: 'Membre',
          hasResponsableAccess: false
        });
        return;
      }

      // 4. Dernier utilisateur actif
      let lastUser = null;
      try {
        lastUser = JSON.parse(localStorage.getItem('ht_current_user') || 'null');
      } catch (e) {}

      if (lastUser && (
        (lastUser.email && lastUser.email.toLowerCase() === cleanLower) ||
        (lastUser.telephone && lastUser.telephone.replace(/[^0-9+]/g, '') === cleanPhone)
      )) {
        login(cleanId, directPassword, lastUser);
        return;
      }

      // 5. Connexion Membre directe
      login(cleanId, directPassword, {
        prenom: cleanId.includes('@') ? cleanId.split('@')[0] : 'Membre',
        nom: '',
        email: cleanId.includes('@') ? cleanId : '',
        telephone: !cleanId.includes('@') ? cleanId : '',
        role: 'Membre',
        hasResponsableAccess: false
      });

    } catch (err) {
      console.error('Erreur connexion directe:', err);
      setErrorMessage('Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance to Step 2
  const handleStep1Next = () => {
    setErrorMessage('');
    if (!role) {
      setErrorMessage('Veuillez sélectionner votre statut pour continuer.');
      return;
    }
    setStep(2);
  };

  // Advance to Step 3
  const handleStep2Next = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!prenom.trim() || !nom.trim()) {
      setErrorMessage('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!telephone.trim()) {
      setErrorMessage('Veuillez saisir votre numéro de téléphone.');
      return;
    }
    setStep(3);
  };

  // Validation Étape 3 (Email & Mot de passe)
  // Pour un responsable : inscription directe sans aucun code d'accès requis
  // Pour un membre : passage à l'étape 4 pour valider l'affiliation Daara
  const handleStep3Next = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Veuillez définir un mot de passe d\'au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    // Si la personne s'inscrit comme Responsable : aucun code d'accès requis !
    if (role === 'responsable') {
      setIsSubmitting(true);
      try {
        // Jouer le fichier audio officiel
        try {
          const audio = new Audio(audioQasidaMountakha);
          audio.volume = 0.9;
          audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
        } catch (err) {}

        const respData = {
          role: 'Super Admin',
          hasResponsableAccess: true,
          prenom: prenom.trim(),
          nom: nom.trim(),
          telephone: telephone.trim(),
          email: email.trim().toLowerCase()
        };
        saveUserLocally(respData);
        login(email, password, respData);
      } catch (err) {
        console.error('Erreur inscription responsable:', err);
        setErrorMessage("Une erreur est survenue lors de l'accès. Veuillez réessayer.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Pour le rôle Membre uniquement : passage à l'Étape 4 pour valider le code d'accès Daara
    setStep(4);
  };

  // Validation Étape 4 : Vérification du Code d'accès Membre
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const trimmedCode = codeAcces.trim();
    if (!trimmedCode) {
      setErrorMessage("Veuillez saisir votre code d'accès membre Daara.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Rôle Membre : Vérification avec le code membre officiel
      const expectedMemberCode = appSettings?.memberAccessCode || '188828';
      if (trimmedCode !== expectedMemberCode) {
        setErrorMessage("Code d'accès membre incorrect. Veuillez vous rapprocher de votre responsable de Dahira.");
        setIsSubmitting(false);
        return;
      }

      // Jouer le fichier audio officiel
      try {
        const audio = new Audio(audioQasidaMountakha);
        audio.volume = 0.9;
        audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
      } catch (err) {}

      const membreData = {
        role: 'Membre',
        hasResponsableAccess: false,
        prenom: prenom.trim(),
        nom: nom.trim(),
        telephone: telephone.trim(),
        email: email.trim().toLowerCase(),
        codeAcces: trimmedCode
      };
      saveUserLocally(membreData);
      login(email, password, membreData);
      setIsSubmitting(false);

    } catch (err) {
      console.error('Erreur soumission auth:', err);
      setErrorMessage("Une erreur est survenue lors de la vérification. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F6FAF7] flex flex-col justify-between items-center relative overflow-x-hidden font-sans select-none px-4 py-8 sm:py-12 animate-fade-in text-slate-800">
      
      {/* Background Ambient Decorative Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-amber-300/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header with Back button and 4-step progress indicator */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between relative z-20 pb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-soft-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
        ) : <div />}

        {/* Progress Indicator ou Badge Mode Connexion */}
        {authMode === 'register' ? (
          <div className="flex items-center gap-1.5" title={`Étape ${step} sur ${role === 'responsable' ? 3 : 4}`}>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 1 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 2 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 3 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
            {role === 'membre' && (
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 4 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
            )}
          </div>
        ) : (
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            Espace Connexion
          </span>
        )}
      </header>

      {/* Center Main Card */}
      <main className="relative z-10 w-full max-w-xl sm:max-w-2xl my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-11 lg:p-14 border border-emerald-100/90 shadow-[0_25px_60px_-15px_rgba(22,91,60,0.15)] transition-all">
          
          {/* Official Logo Showcase */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="w-full max-w-[240px] sm:max-w-[280px] h-20 sm:h-24 flex items-center justify-center p-1 mb-2 group transition-transform duration-300 hover:scale-105">
              <img 
                src={logoOfficial} 
                alt="Sama Kourel" 
                className="max-h-full max-w-full object-contain filter drop-shadow-sm" 
              />
            </div>
            
            {/* Arabic Calligraphy Title Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs mb-1">
              <span className="font-arabic text-lg sm:text-xl font-bold text-emerald-900 tracking-wider">
                سَمَا كُورِيلْ
              </span>
              <span className="text-emerald-400">•</span>
              <span className="font-serif font-bold text-xs text-amber-800 tracking-wider uppercase">
                Sama Kourel
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-3xl text-slate-900 tracking-tight mt-2">
              {authMode === 'login'
                ? "Connexion à votre Compte"
                : (step === 1 ? "Êtes-vous Membre ou Responsable ?" :
                   step === 2 ? "Renseignez vos coordonnées" :
                   step === 3 ? (role === 'responsable' ? "Inscription Espace Responsable" : "Renseignez votre Email et Mot de passe") :
                   "Validation de votre affiliation Membre"
                  )
              }
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {authMode === 'login'
                ? "Saisissez vos identifiants pour accéder directement à votre espace"
                : "Rejoignez la plateforme officielle Sama Kourel"
              }
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =========================================================================
              MODE CONNEXION DIRECTE (POUR CEUX QUI ONT DÉJÀ UN COMPTE)
          ========================================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleDirectLogin} className="space-y-5 animate-fade-in text-left">
              {/* Identifiant : Email ou Téléphone */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Email ou Numéro de Téléphone
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={directIdentifier}
                    onChange={(e) => setDirectIdentifier(e.target.value)}
                    placeholder="ex: modou.fall@gmail.com ou 77 123 45 67"
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showDirectPassword ? "text" : "password"}
                    required
                    value={directPassword}
                    onChange={(e) => setDirectPassword(e.target.value)}
                    placeholder="Votre mot de passe secret"
                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDirectPassword(!showDirectPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showDirectPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Bouton Se Connecter */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? "Connexion en cours..." : "Se connecter"}</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Basculer vers inscription */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Vous n'avez pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setAuthMode('register');
                      setStep(1);
                    }}
                    className="font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer ml-1"
                  >
                    Créer un compte / Rejoindre
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* =========================================================================
              MODE INSCRIPTION / NOUVEAU COMPTE
          ========================================================================= */}
          {authMode === 'register' && step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Membre */}
                <div
                  onClick={() => {
                    setRole('membre');
                    setErrorMessage('');
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    role === 'membre'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-soft-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                      role === 'membre' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      role === 'membre' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {role === 'membre' && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">Membre</h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                      Suivi de mes présences, répétitions de Khassidas et lecture du Saint Coran.
                    </p>
                  </div>
                </div>

                {/* Option 2: Responsable / Superviseur */}
                <div
                  onClick={() => {
                    setRole('responsable');
                    setErrorMessage('');
                  }}
                  className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                    role === 'responsable'
                      ? 'border-amber-500 bg-amber-50/70 shadow-soft-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-colors ${
                      role === 'responsable' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                      role === 'responsable' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                    }`}>
                      {role === 'responsable' && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">Responsable</h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                      Gestion des kourels, pointages en temps réel, audios et administration.
                    </p>
                  </div>
                </div>

              </div>

              {/* Step 1 Button */}
              <button
                type="button"
                onClick={handleStep1Next}
                className="w-full mt-6 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
              >
                <span>Continuer</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Basculer vers connexion pour compte existant */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs sm:text-sm text-slate-600">
                  Vous avez déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setAuthMode('login');
                    }}
                    className="font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer ml-1"
                  >
                    Se connecter directement
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 2 : Nom, Prénom et Numéro de Téléphone
          ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-5 animate-fade-in">
              
              {/* Prénom et Nom côte à côte sur écran moyen/large */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Votre prénom"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Nom
                  </label>
                  <div className="relative">
                    <UserCheck className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Numéro de téléphone */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Numéro de Téléphone
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="ex: +221 77 000 00 00"
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Navigation Buttons Step 2 */}
              <div className="flex items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              ÉTAPE 3 : Adresse Email, Mot de passe et Confirmation
          ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleStep3Next} className="space-y-5 animate-fade-in">
              
              {/* Adresse Email (Remplace le Matricule) */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Mot de passe et Confirmation côte à côte sur écran moyen/large */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mot de passe */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmation Mot de passe */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Confirmation
                  </label>
                  <div className="relative">
                    <CheckCircle2 className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 ${
                      confirmPassword && confirmPassword === password ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-12 pr-12 py-3.5 sm:py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all font-medium tracking-wider ${
                        confirmPassword && confirmPassword !== password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-500/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showConfirmPassword ? "Masquer" : "Afficher"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons Step 3 */}
              <div className="flex items-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connexion en cours...</span>
                    </div>
                  ) : role === 'responsable' ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-200" />
                      <span>Accéder directement à la plateforme</span>
                      <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Continuer vers le code membre</span>
                      <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              ÉTAPE 4 : Code d'accès sécurisé (Uniquement pour Membre)
          ========================================================================= */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              
              {/* Badge d'indication de sécurité */}
              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3.5 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-950 text-sm">
                    Validation d'affiliation à la Daara
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Veuillez saisir le code d'accès membre qui vous a été remis par votre responsable de Dahira.
                  </p>
                </div>
              </div>

              {/* Champ Code d'Accès */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider text-center">
                  Code d'accès membre Daara
                </label>
                <div className="relative max-w-sm mx-auto">
                  <KeyRound className="w-6 h-6 text-emerald-700 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    autoFocus
                    value={codeAcces}
                    onChange={(e) => setCodeAcces(e.target.value)}
                    placeholder="••••••"
                    maxLength={12}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-emerald-600/40 focus:border-emerald-700 rounded-2xl text-center text-xl sm:text-2xl text-emerald-950 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all font-mono font-black tracking-widest shadow-inner"
                  />
                </div>
              </div>

              {/* Navigation Buttons Step 4 */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Vérification du code...</span>
                    </div>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5 text-emerald-200" />
                      <span>Valider mon affiliation & Accéder</span>
                      <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      {/* Discrete Footer */}
      <footer className="relative z-20 text-center pt-4">
        <p className="text-xs text-slate-400 font-semibold">
          Sama Kourel • سَمَا كُورِيلْ • Système Sécurisé de Gestion Associative
        </p>
      </footer>

    </div>
  );
};

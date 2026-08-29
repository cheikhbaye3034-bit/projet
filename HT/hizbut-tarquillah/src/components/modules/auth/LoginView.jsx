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

export const LoginView = ({ onBack }) => {
  const { login, appSettings } = useApp();
  
  // Multi-step state: 1, 2, 3, 4
  const [step, setStep] = useState(1);
  
  // Step 1: Role
  const [role, setRole] = useState('membre'); // 'membre' | 'responsable'
  
  // Step 2: Personal Identity & Contact
  const [prenom, setPrenom] = useState('Cheikh');
  const [nom, setNom] = useState('Ndiaye');
  const [telephone, setTelephone] = useState('+221 77 654 32 10');
  
  // Step 3: Email & Password
  const [email, setEmail] = useState('cheikh.ndiaye@hizbut-tarquillah.sn');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 4: Access Code
  const [codeAcces, setCodeAcces] = useState('188828');

  // UI & Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Advance to Step 4 (Validation of Email & Password)
  const handleStep3Next = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse email valide.');
      return;
    }
    if (!password) {
      setErrorMessage('Veuillez définir un mot de passe.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setStep(4);
  };

  // Final Submit on Step 4 (Access Code Validation -> Play Audio & Direct Login)
  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!codeAcces.trim()) {
      setErrorMessage("Veuillez saisir votre code d'accès de sécurité.");
      return;
    }

    // Validate code against dynamic settings
    const expectedCode = role === 'responsable'
      ? (appSettings?.responsableAccessCode || '994201')
      : (appSettings?.memberAccessCode || '188828');

    if (codeAcces.trim() !== expectedCode) {
      setErrorMessage("Code d'accès incorrect. Veuillez contacter votre responsable.");
      return;
    }

    setIsSubmitting(true);

    // Play the audio automatically upon connection
    try {
      const audio = new Audio(audioQasidaMountakha);
      audio.volume = 0.9;
      audio.play().catch((err) => {
        console.log('Audio autoplay prevented or error:', err);
      });
    } catch (err) {
      console.log('Audio init error:', err);
    }

    setTimeout(() => {
      login(email, password, { 
        role, 
        prenom, 
        nom, 
        telephone, 
        email, 
        codeAcces 
      });
      setIsSubmitting(false);
    }, 450);
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

        {/* 4-Step Progress Indicator */}
        <div className="flex items-center gap-1.5" title={`Étape ${step} sur 4`}>
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 1 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 2 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 3 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === 4 ? 'bg-emerald-700 w-6' : 'bg-slate-300'}`} />
        </div>
      </header>

      {/* Center Main Card */}
      <main className="relative z-10 w-full max-w-xl sm:max-w-2xl my-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-11 lg:p-14 border border-emerald-100/90 shadow-[0_25px_60px_-15px_rgba(22,91,60,0.15)] transition-all">
          
          {/* Official Logo Showcase */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
            <div className="w-full max-w-[240px] sm:max-w-[280px] h-20 sm:h-24 flex items-center justify-center p-1 mb-2 group transition-transform duration-300 hover:scale-105">
              <img 
                src={logoOfficial} 
                alt="Hizbut-Tarqiyyah" 
                className="max-h-full max-w-full object-contain filter drop-shadow-sm" 
              />
            </div>
            
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-3xl text-slate-900 tracking-tight mt-2">
              {step === 1 && "Êtes-vous Membre ou Responsable ?"}
              {step === 2 && "Renseignez vos coordonnées"}
              {step === 3 && "Renseignez votre Email et Mot de passe"}
              {step === 4 && "Saisissez votre Code d'accès"}
            </h1>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =========================================================================
              ÉTAPE 1 : Êtes-vous Membre ou Responsable ?
          ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Option 1: Membre */}
                <div
                  onClick={() => {
                    setRole('membre');
                    setEmail('cheikh.ndiaye@hizbut-tarquillah.sn');
                    setCodeAcces('188828');
                    setPrenom('Cheikh');
                    setNom('Ndiaye');
                    setTelephone('+221 77 654 32 10');
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
                    setEmail('admin.modou@hizbut-tarquillah.sn');
                    setCodeAcces('994201');
                    setPrenom('Serigne Modou');
                    setNom('Kara');
                    setTelephone('+221 77 500 12 34');
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
                      placeholder="ex: Cheikh"
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
                      placeholder="ex: Ndiaye"
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
                    placeholder="ex: +221 77 654 32 10"
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
                    placeholder="ex: cheikh.ndiaye@hizbut-tarquillah.sn"
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
                  className="flex-1 py-4 sm:py-4.5 px-8 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-900 hover:to-emerald-800 text-white font-display font-bold text-sm sm:text-base rounded-2xl shadow-[0_12px_28px_-5px_rgba(22,91,60,0.35)] hover:shadow-[0_16px_34px_-5px_rgba(22,91,60,0.45)] transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              ÉTAPE 4 : Code d'accès sécurisé (pour Membre et Responsable)
          ========================================================================= */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              
              {/* Badge d'indication de sécurité */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-900">
                    Vérification d'accès • {role === 'responsable' ? 'Espace Responsable / Superviseur' : 'Espace Membre du Kourel'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Veuillez saisir le code d'accès confidentiel attribué par la Daara Hizbut-Tarqiyyah pour sécuriser et valider votre session.
                  </p>
                </div>
              </div>

              {/* Champ Code d'Accès */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider text-center">
                  Code d'accès confidentiel
                </label>
                <div className="relative max-w-sm mx-auto">
                  <KeyRound className="w-6 h-6 text-emerald-700 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={codeAcces}
                    onChange={(e) => setCodeAcces(e.target.value)}
                    placeholder="ex: 188828"
                    maxLength={12}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-2 border-emerald-600/40 focus:border-emerald-700 rounded-2xl text-center text-xl sm:text-2xl text-emerald-950 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 transition-all font-mono font-black tracking-widest uppercase shadow-inner"
                  />
                </div>
                
                <p className="text-[11px] text-slate-500 text-center pt-1 font-medium">
                  Code prérempli pour démo : <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{role === 'responsable' ? '994201' : '188828'}</span>
                </p>
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
                      <ShieldCheck className="w-5 h-5 text-emerald-200" />
                      <span>Accéder à la plateforme</span>
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
          Hizbut-Tarqiyyah • Système Sécurisé de Gestion Associative
        </p>
      </footer>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  TrendingUp,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import accueilHeroDahira from '../../../assets/images/accueil_hero_dahira.png';
import accueilCitationBamba from '../../../assets/images/accueil_citation_bamba.jpg';
import slideCalifeMountakha from '../../../assets/images/slide_calife_mountakha.jpg';
import slideKourelRecitation from '../../../assets/images/slide_kourel_recitation.jpg';
import slideRepetitionStudio from '../../../assets/images/slide_repetition_studio.png';

export const MembreAccueilTab = ({ onNavigateTab }) => {
  const { currentUser, seances, kamilCycle, informations, kourels } = useApp();

  const memberKourel = kourels.find(k => k.id === currentUser?.kourel_id) || kourels[0];

  // Filter personal attendance statistics
  const memberPresences = seances.reduce((acc, seance) => {
    const p = seance.presences?.find(item => item.membre_id === currentUser?.id);
    if (p) {
      acc.total++;
      if (p.statut === 'Présent') acc.presents++;
      else if (p.statut === 'En retard') acc.retards++;
      else if (p.statut === 'Absent') acc.absents++;
    }
    return acc;
  }, { total: 0, presents: 0, retards: 0, absents: 0 });

  const effectiveStats = memberPresences.total > 0 ? memberPresences : { total: 12, presents: 11, retards: 1, absents: 0 };
  const attendanceRate = Math.round(((effectiveStats.presents + effectiveStats.retards * 0.5) / effectiveStats.total) * 100);

  // Next upcoming session
  const upcomingSeance = seances.find(s => s.kourel_id === (currentUser?.kourel_id || 'k1') && (s.statut === 'Planifiée' || s.statut === 'En cours')) || seances[0];

  // Pinned announcement
  const pinnedInfos = informations ? informations.filter(i => i.epingle) : [];
  const latestInfo = pinnedInfos[0] || informations[0];

  // Dynamic Gregorian Date
  const currentFormattedDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  // Slider for bottom card (3 sliding images)
  const slides = [
    {
      image: slideCalifeMountakha,
      title: "Serigne Mountakha Bassirou Mbacké",
      subtitle: "Khalife Général des Mourides (Yalla nafi yàgg lool te wër)",
      tag: "Guide Spirituel & Bénédiction"
    },
    {
      image: slideKourelRecitation,
      title: "Kourel Hizbut-Tarqiyyah",
      subtitle: "Récitation collective des Khassidas de Cheikh Ahmadou Bamba",
      tag: "Dévotion & Prestation"
    },
    {
      image: slideRepetitionStudio,
      title: "Séances de Répétition Vocale",
      subtitle: "Harmonie et perfectionnement du chant sacré des Khassidas",
      tag: "Répétitions & Kourel"
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-4 select-none">
      
      {/* =========================================================================
          HERO CARD : MODÈLE INSPIRÉ DU SCREENSHOT (VERT ÉMERAUDE ISLAMIQUE)
      ========================================================================= */}
      <div className="relative rounded-[28px] sm:rounded-3xl p-5 sm:p-7 text-white shadow-[0_14px_40px_-10px_rgba(16,91,60,0.45)] border border-[#E4CE98]/30 overflow-hidden select-none">
        
        {/* Background Photo: Dahira Repetition */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${accueilHeroDahira})` }}
        />
        
        {/* Dark Emerald Gradient Overlay for crisp readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#105B3C]/95 via-[#144631]/88 to-[#0A2E1E]/92" />
        
        {/* Islamic Geometric Arabesque Background Pattern Overlay */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none stroke-white fill-none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern id="islamic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect x="15" y="15" width="30" height="30" strokeWidth="1" />
            <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" strokeWidth="1" />
            <circle cx="30" cy="30" r="12" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>

        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          
          {/* Top Bar: Hijri Date (Left) & Gregorian Date (Right) */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-emerald-100/90 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 text-sm">🌙</span>
              <span className="font-semibold tracking-wide">6 Rabīʿ al-awwal 1448 - Touba</span>
            </div>
            <div className="font-semibold tracking-wide capitalize">
              {currentFormattedDate}
            </div>
          </div>

          {/* Middle Row: Next Repetition (Left) & Countdown Circle Ring (Right) */}
          <div className="flex items-center justify-between gap-4">
            
            <div className="space-y-1">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-extrabold text-emerald-200/90 block">
                PROCHAINE RÉPÉTITION
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none pt-1">
                {upcomingSeance?.titre || memberKourel?.nom?.split('—')[0]?.trim() || 'Kourel 1'}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-emerald-200 pt-1">
                à {upcomingSeance?.heure_debut || '20:30'}
              </p>
            </div>

            {/* Circular Progress Countdown Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white/20"
                  strokeWidth="7"
                  fill="none"
                />
                {/* Progress Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-white"
                  strokeWidth="7"
                  strokeDasharray="264"
                  strokeDashoffset="75"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                <span className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                  4 Jours
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-200 font-semibold mt-0.5">
                  restants
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Row: 5 Rounded Stats Capsules (Présences, Retards, Absences, etc.) */}
          <div className="grid grid-cols-5 gap-2 pt-1 sm:pt-2">
            
            {/* Box 1: Présences (Active white pill like in screenshot) */}
            <div className="rounded-2xl p-2 sm:p-3 bg-white text-[#144631] shadow-lg flex flex-col items-center justify-center text-center transition-transform transform active:scale-95">
              <span className="text-[10px] sm:text-xs font-bold opacity-90 truncate max-w-full">
                Présences
              </span>
              <span className="text-sm sm:text-base font-display font-black leading-tight mt-0.5">
                {effectiveStats.presents}
              </span>
            </div>

            {/* Box 2: Retards */}
            <div className="rounded-2xl p-2 sm:p-3 bg-white/15 backdrop-blur-md border border-white/15 text-white flex flex-col items-center justify-center text-center transition-colors hover:bg-white/20">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-100/80 truncate max-w-full">
                Retards
              </span>
              <span className="text-sm sm:text-base font-display font-black leading-tight mt-0.5">
                {effectiveStats.retards}
              </span>
            </div>

            {/* Box 3: Absences */}
            <div className="rounded-2xl p-2 sm:p-3 bg-white/15 backdrop-blur-md border border-white/15 text-white flex flex-col items-center justify-center text-center transition-colors hover:bg-white/20">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-100/80 truncate max-w-full">
                Absences
              </span>
              <span className="text-sm sm:text-base font-display font-black leading-tight mt-0.5">
                {effectiveStats.absents}
              </span>
            </div>

            {/* Box 4: Assiduité */}
            <div className="rounded-2xl p-2 sm:p-3 bg-white/15 backdrop-blur-md border border-white/15 text-white flex flex-col items-center justify-center text-center transition-colors hover:bg-white/20">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-100/80 truncate max-w-full">
                Assiduité
              </span>
              <span className="text-sm sm:text-base font-display font-black leading-tight mt-0.5">
                {attendanceRate}%
              </span>
            </div>

            {/* Box 5: Total Séances */}
            <div className="rounded-2xl p-2 sm:p-3 bg-white/15 backdrop-blur-md border border-white/15 text-white flex flex-col items-center justify-center text-center transition-colors hover:bg-white/20">
              <span className="text-[10px] sm:text-xs font-medium text-emerald-100/80 truncate max-w-full">
                Total
              </span>
              <span className="text-sm sm:text-base font-display font-black leading-tight mt-0.5">
                {effectiveStats.total}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          CARTE DE CITATION SPIRITUELLE (AÉRÉE, NOBLE & HARMONIEUSE)
      ========================================================================= */}
      <div className="relative rounded-[28px] sm:rounded-3xl p-6 sm:p-9 text-white shadow-[0_14px_35px_-10px_rgba(10,41,27,0.4)] border border-[#E5B246]/40 overflow-hidden select-none">
        
        {/* Background Photo: Cheikh Ahmadou Bamba Portrait */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${accueilCitationBamba})` }}
        />
        
        {/* Deep Dark Overlay for crisp text readability over portrait */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />
        
        {/* Warm Golden Ambient Lights */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E5B246]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          
          {/* Top Bar: Badge AH DOOM (Left) & Elegant Quotation Mark (Right) */}
          <div className="flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D49E34] via-[#E5B246] to-[#D49E34] text-[#0A291B] text-xs font-black uppercase tracking-[0.15em] shadow-md">
              AH DOOM
            </span>

            <span className="text-[#E5B246]/50 text-5xl sm:text-6xl font-serif font-black leading-none select-none">
              &ldquo;
            </span>
          </div>

          {/* Main Quote Content */}
          <blockquote className="font-['Playfair_Display',serif] text-lg sm:text-xl lg:text-2xl font-medium sm:font-semibold text-white leading-loose sm:leading-[2.2] tracking-wide text-left pt-1 drop-shadow-md">
            &laquo; Doom Yalla mima moom moonema S&euml;ri&ntilde; Bamba moola moom leegi wariko te j&eacute;bbal ko sa bopu. &raquo;
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-px h-6 bg-[#E5B246]/50" />
            <span className="text-xs font-bold text-[#E5B246]/90 tracking-wide uppercase">
              Cheikh Ahmadou Bamba — Khadimou Rassoul
            </span>
          </div>

        </div>

      </div>

      {/* =========================================================================
          DUO DE CARTES : DIAPORAMA DÉFILANT & INFORMATIONS OFFICIELLES
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-1">
        
        {/* ==================== 1. CARTE DIAPORAMA DES 3 IMAGES DÉFILANTES ==================== */}
        <div 
          className="relative rounded-[26px] sm:rounded-3xl min-h-[260px] sm:min-h-[280px] text-white shadow-[0_12px_35px_-10px_rgba(14,61,42,0.38)] border border-[#E5B246]/40 flex flex-col justify-between overflow-hidden group select-none transition-all duration-300"
        >
          {/* Slides Images and Transition */}
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with slight Ken Burns effect */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-6000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                
                {/* Gradient Overlays for perfect readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-black/50" />
              </div>
            );
          })}

          {/* Top Bar: Slide Tag Badge & Navigation Arrows */}
          <div className="relative z-20 p-5 sm:p-6 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-black/60 text-amber-300 border border-amber-400/50 backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{slides[currentSlideIndex].tag}</span>
            </span>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-md">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Image précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
                }}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Image suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Bar: Title, Subtitle & Indicator Dots */}
          <div className="relative z-20 p-5 sm:p-6 pt-0 space-y-2.5">
            <div className="space-y-0.5">
              <h3 className="font-display font-black text-lg sm:text-xl text-white drop-shadow-md leading-tight">
                {slides[currentSlideIndex].title}
              </h3>
              <p className="text-xs text-emerald-100/90 font-medium line-clamp-1 drop-shadow-xs">
                {slides[currentSlideIndex].subtitle}
              </p>
            </div>

            {/* Slide Indicator Dots Bar */}
            <div className="flex items-center gap-1.5 pt-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlideIndex 
                      ? 'w-8 bg-gradient-to-r from-amber-300 to-amber-400 shadow-sm' 
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ==================== 2. CARTE INFORMATIONS OFFICIELLES ==================== */}
        <div 
          onClick={() => onNavigateTab('info')}
          className="relative rounded-[26px] sm:rounded-3xl p-6 sm:p-7 bg-white text-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/90 flex flex-col justify-between space-y-5 cursor-pointer active:scale-[0.98] hover:border-emerald-300 hover:shadow-soft-lg transition-all duration-300 group overflow-hidden min-h-[260px] sm:min-h-[280px]"
        >
          {/* Card Top: Category Badge & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200/80 flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 text-emerald-700 fill-emerald-600" />
                <span>{latestInfo?.categorie || 'Communiqué Officiel'}</span>
              </span>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              {latestInfo?.date_publication || 'Août 2026'}
            </span>
          </div>

          {/* Card Middle: Announcement Title and Excerpt */}
          <div className="space-y-1.5 pt-1">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug line-clamp-2">
              {latestInfo?.titre || "Répétition générale avant l'événement du Dahira"}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
              {latestInfo?.contenu || "Consultez l'ensemble des directives, calendrier des répétitions et recommandations de la section."}
            </p>
          </div>

          {/* Card Bottom: Issuer & Action CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold truncate max-w-[150px] text-[11px]">
              {latestInfo?.auteur || 'Dahira Central'}
            </span>

            <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-xs group-hover:text-emerald-950">
              <span>Lire le communiqué</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

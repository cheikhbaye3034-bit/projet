import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Mic, 
  Users, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';
import officialBg from '../../../assets/images/welcome_official_bg.png';

export const LandingView = ({ onStartLogin }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: Mic,
      title: "Répétitions & Khassidas",
      desc: "Planification par kourel, ressources audio de référence et feuilles de présence en temps réel.",
      badge: "Kourels & Audio"
    },
    {
      id: 1,
      icon: BookOpen,
      title: "Suivi Collectif du Kamil",
      desc: "Grille interactive des 60 Jukis / 30 Juz' répartis entre les membres avec code couleur.",
      badge: "Saint Coran"
    },
    {
      id: 2,
      icon: Users,
      title: "Membres & Fraternité",
      desc: "Annuaire complet, historique d'assiduité et pilotage multi-superviseurs.",
      badge: "Gestion Dahira"
    }
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between items-center overflow-x-hidden font-sans select-none text-slate-900 bg-[#092B1D]">
      
      {/* 
        OFFICIAL BACKGROUND IMAGE:
        Takes full page, preserving top ribbon and bottom waves.
      */}
      <div 
        className="fixed inset-0 bg-cover bg-top sm:bg-center bg-no-repeat pointer-events-none transition-all duration-700"
        style={{ 
          backgroundImage: `url(${officialBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}
      />

      {/* 
        CLEAN WHITE OVERLAY ON THE CENTRAL WHITE AREA:
        Masks the old center watermark completely while keeping top ribbon (0-14%) and bottom waves (86-100%) visible.
      */}
      <div className="fixed inset-x-0 top-[11%] bottom-[12%] bg-gradient-to-b from-white/95 via-white to-white/95 pointer-events-none" />

      {/* =========================================================================
          TOP GREEN SECTION: ISLAMIC DECORATIVE ORNAMENTS (Varieties of Green)
          Features: Rub el Hizb (8-point stars), arabesque geometric interlacings, 
          and jade/emerald/mint floral accents.
      ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-20 sm:h-28 md:h-32 pointer-events-none overflow-hidden z-10 flex items-start justify-center">
        
        {/* Ambient Jade & Emerald Glows */}
        <div className="absolute top-1 left-1/4 w-48 sm:w-80 h-16 bg-[#34D399]/25 blur-2xl rounded-full" />
        <div className="absolute top-1 right-1/4 w-48 sm:w-80 h-16 bg-[#10B981]/20 blur-2xl rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-12 bg-[#6EE7B7]/20 blur-xl rounded-full" />

        {/* Decorative Geometric Arabesque Banner */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-2 sm:pt-4 flex items-center justify-between opacity-85">
          
          {/* Left Decorative Wing (Mint & Sage Green Arabesques) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#34D399]/70 animate-pulse" viewBox="0 0 100 100" fill="currentColor">
              {/* 8-Pointed Star (Rub el Hizb) */}
              <polygon points="50,5 63,37 95,50 63,63 50,95 37,63 5,50 37,37" fill="currentColor" fillOpacity="0.4" stroke="#6EE7B7" strokeWidth="2" />
              <polygon points="50,15 60,40 85,50 60,60 50,85 40,60 15,50 40,40" fill="none" stroke="#A7F3D0" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="8" fill="#10B981" fillOpacity="0.8" />
            </svg>

            {/* Interlaced Floral Waves */}
            <svg className="hidden sm:block w-32 md:w-48 h-6 text-[#10B981]/50" viewBox="0 0 200 30" fill="none">
              <path d="M0,15 Q25,0 50,15 T100,15 T150,15 T200,15" stroke="#34D399" strokeWidth="2" strokeOpacity="0.6" fill="none" />
              <path d="M0,15 Q25,30 50,15 T100,15 T150,15 T200,15" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
              <circle cx="50" cy="15" r="3" fill="#6EE7B7" />
              <circle cx="100" cy="15" r="4" fill="#34D399" />
              <circle cx="150" cy="15" r="3" fill="#6EE7B7" />
            </svg>
          </div>

          {/* Centerpiece Rosette / Arabesque Medallion */}
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-8 h-8 sm:w-11 sm:h-11 text-[#6EE7B7]/80" viewBox="0 0 100 100">
              {/* Outer interlaced squares */}
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#34D399" strokeWidth="2" transform="rotate(0 50 50)" strokeOpacity="0.7" />
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#10B981" strokeWidth="2" transform="rotate(45 50 50)" strokeOpacity="0.8" />
              <polygon points="50,0 60,35 95,50 60,65 50,100 40,65 5,50 40,35" fill="#047857" fillOpacity="0.35" stroke="#A7F3D0" strokeWidth="1" />
              <circle cx="50" cy="50" r="12" fill="#065F46" stroke="#6EE7B7" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="5" fill="#34D399" />
            </svg>
          </div>

          {/* Right Decorative Wing (Emerald & Jade Green Arabesques) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Interlaced Floral Waves */}
            <svg className="hidden sm:block w-32 md:w-48 h-6 text-[#10B981]/50" viewBox="0 0 200 30" fill="none">
              <path d="M0,15 Q25,0 50,15 T100,15 T150,15 T200,15" stroke="#34D399" strokeWidth="2" strokeOpacity="0.6" fill="none" />
              <path d="M0,15 Q25,30 50,15 T100,15 T150,15 T200,15" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
              <circle cx="50" cy="15" r="3" fill="#6EE7B7" />
              <circle cx="100" cy="15" r="4" fill="#34D399" />
              <circle cx="150" cy="15" r="3" fill="#6EE7B7" />
            </svg>

            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#34D399]/70 animate-pulse" viewBox="0 0 100 100" fill="currentColor">
              {/* 8-Pointed Star (Rub el Hizb) */}
              <polygon points="50,5 63,37 95,50 63,63 50,95 37,63 5,50 37,37" fill="currentColor" fillOpacity="0.4" stroke="#6EE7B7" strokeWidth="2" />
              <polygon points="50,15 60,40 85,50 60,60 50,85 40,60 15,50 40,40" fill="none" stroke="#A7F3D0" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="8" fill="#10B981" fillOpacity="0.8" />
            </svg>
          </div>

        </div>
      </div>

      {/* Top spacing to let the top green ribbon design breathe */}
      <div className="w-full h-10 sm:h-16 relative z-10" aria-hidden="true" />

      {/* =========================================================================
          MAIN HERO CONTENT (Placed in the central clear white area)
      ========================================================================= */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center justify-center text-center relative z-20 space-y-4 sm:space-y-6 my-auto">
        
        {/* Bismillah Calligraphy in Arabic */}
        <div className="inline-block pt-1">
          <span className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#144631] font-bold tracking-widest drop-shadow-sm font-['Amiri',serif]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {/* Prestigious Main Heading */}
        <div className="space-y-2 max-w-3xl">
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] leading-[1.2] text-[#114B31] font-bold tracking-tight">
            Plateforme de Gestion & de Dévotion
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#2C4638] font-medium leading-relaxed max-w-2xl mx-auto">
            Au service des Khassidas de <span className="font-bold text-[#144631]">Cheikh Ahmadou Bamba</span>, de la récitation intégrale du <span className="font-bold text-[#B68222]">Saint Coran</span> et de la cohésion des kourels.
          </p>
        </div>

        {/* 3 Interactive Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-4xl pt-1">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSelected = activeFeature === feat.id;
            return (
              <div
                key={feat.id}
                onMouseEnter={() => setActiveFeature(feat.id)}
                onClick={() => setActiveFeature(feat.id)}
                className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer border text-left flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white border-[#D4AF37] shadow-[0_10px_25px_rgba(20,70,49,0.12)] scale-[1.02]' 
                    : 'bg-white/85 border-slate-200/80 hover:bg-white shadow-soft-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-colors ${
                    isSelected 
                      ? 'bg-[#144631] text-[#E5B246]' 
                      : 'bg-emerald-50 text-[#144631]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FAF5E6] text-[#9B6A15] border border-[#E4CE98]/60">
                    {feat.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Call To Action Button */}
        <div className="pt-2 w-full max-w-sm flex flex-col items-center space-y-2.5">
          <button
            onClick={onStartLogin}
            className="w-full py-3.5 sm:py-4 px-8 bg-gradient-to-r from-[#D49E34] via-[#E5B246] to-[#D49E34] hover:from-[#E5B246] hover:to-[#D49E34] active:scale-[0.98] text-white font-display font-bold text-sm sm:text-base rounded-full shadow-[0_12px_28px_-5px_rgba(212,158,52,0.5)] hover:shadow-[0_16px_34px_-5px_rgba(212,158,52,0.65)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Accéder à la plateforme</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Accès sécurisé pour Superviseurs & Administrateurs</span>
          </p>
        </div>

      </main>

      {/* =========================================================================
          BOTTOM FOOTER SECTION (Positioned above the bottom ribbon artwork)
      ========================================================================= */}
      <footer className="w-full max-w-7xl mx-auto pb-4 sm:pb-6 px-4 text-center relative z-20 space-y-1">
        <p className="text-xs sm:text-sm text-[#144631] font-serif font-bold tracking-wide">
          « Au service exclusif de Cheikh Ahmadou Bamba Khadimou Rassoul (R.T.A) »
        </p>
        <p className="text-[10px] text-slate-500 font-medium">
          Sama Kourel • سَمَا كُورِيلْ • Tous droits réservés • Système de Gestion v1.0
        </p>
      </footer>

    </div>
  );
};

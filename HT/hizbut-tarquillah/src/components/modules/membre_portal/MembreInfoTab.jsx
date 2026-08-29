import React, { useState } from 'react';
import { 
  Newspaper, 
  Bookmark, 
  Calendar, 
  Search, 
  Tag, 
  User, 
  Clock, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import infoHeroRegie from '../../../assets/images/info_hero_regie.jpg';

export const MembreInfoTab = () => {
  const { informations } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Événement', 'Annonce', 'Communiqué'];

  // Filter info items
  const filteredInfos = (informations || []).filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categorie === selectedCategory;
    const matchesSearch = item.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Separate pinned and standard announcements
  const pinnedList = filteredInfos.filter(i => i.epingle);
  const standardList = filteredInfos.filter(i => !i.epingle);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 select-none">
      
      {/* =========================================================================
          EN-TÊTE DU FIL D'INFORMATIONS AVEC IMAGE RÉGIE AUDIO
      ========================================================================= */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 text-white shadow-soft-xl border border-emerald-500/30">
        {/* Background Image of Audio/Regie Control Room */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${infoHeroRegie})` }}
        />
        {/* Multi-layered Dark-Emerald Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-[#0c2f21]/88 to-black/85 backdrop-blur-[1px]" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black text-amber-300 shadow-xs">
            <Newspaper className="w-3.5 h-3.5 text-amber-300" />
            <span>Communications & Informations Officielles</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
            Fil d'Actualités & Annonces
          </h2>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium drop-shadow-xs">
            Consultez les communiqués, le calendrier des événements et les directives officielles de l'association Hizbut-Tarqiyyah.
          </p>
        </div>
      </div>

      {/* =========================================================================
          BARRE DE RECHERCHE ET FILTRES DE CATÉGORIES
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-soft-sm font-extrabold'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {cat === 'all' ? 'Toutes les actualités' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une annonce..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-soft-xs"
          />
        </div>

      </div>

      {/* =========================================================================
          SECTION : INFORMATIONS ÉPINGLÉES (EN TÊTE)
      ========================================================================= */}
      {pinnedList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase tracking-wider">
            <Bookmark className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>À la Une • Annonces Épinglées</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedList.map((info) => (
              <div 
                key={info.id}
                className="pro-card p-6 border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/50 via-white to-white flex flex-col justify-between space-y-4 shadow-soft-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4AF37] text-white flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      {info.categorie}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {info.date_publication}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {info.titre}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {info.contenu}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">Émis par : {info.auteur}</span>
                  <span className="font-bold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                    Officiel
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION : AUTRES ACTUALITÉS DU FIL
      ========================================================================= */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          Toutes les publications ({standardList.length})
        </h3>

        {standardList.length === 0 ? (
          <div className="pro-card p-8 text-center text-slate-500 text-xs font-semibold">
            Aucune publication ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardList.map((info) => (
              <div 
                key={info.id}
                className="pro-card p-6 flex flex-col justify-between space-y-4 pro-card-hover border border-slate-200/80"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      info.categorie === 'Événement'
                        ? 'bg-blue-100 text-blue-800'
                        : info.categorie === 'Communiqué'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {info.categorie}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {info.date_publication}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {info.titre}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {info.contenu}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Auteur : {info.auteur}</span>
                  <span className="text-emerald-800 font-bold">Dahira Central</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

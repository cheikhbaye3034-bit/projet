import React, { useState } from 'react';
import { Megaphone, Plus, Pin, Calendar, User, Search, Filter, Sparkles, Bookmark } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { InfoModal } from './InfoModal';
import bgInfo from '../../../assets/images/bg_info.jpg';

export const InfoView = () => {
  const { informations, togglePinInformation } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInfos = (informations || []).filter((inf) => {
    const matchesCategory =
      selectedCategory === 'all' || inf.categorie === selectedCategory;
    const matchesSearch =
      inf.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in select-none">
      {/* Hero SaaS Pro Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-emerald-900/10">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgInfo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-900/80 backdrop-blur-[1px]" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-white max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
            <Megaphone className="w-4 h-4 text-emerald-300" />
            <span>Communications & Notes Officielles</span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight">
            Espace Informations & Annonces
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Convocations officielles, programmes d’activités de la Daara, notes de service et communiqués de la Khadimiya.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>Publier un communiqué</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="pro-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une annonce ou note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Événement">Événement</option>
            <option value="Répétition">Répétition</option>
            <option value="Finances">Finances</option>
            <option value="Administratif">Administratif</option>
          </select>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4 max-w-5xl">
        <h3 className="font-display font-black text-lg text-slate-900 flex items-center gap-2">
          <span>Dépêches & Annonces</span>
          <span className="text-xs text-slate-400 font-semibold">({filteredInfos.length} publication{filteredInfos.length > 1 ? 's' : ''})</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {filteredInfos.map((inf) => (
            <div
              key={inf.id}
              className="pro-card p-6 space-y-3.5 pro-card-hover"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-black rounded-full border border-emerald-200">
                    {inf.categorie}
                  </span>
                  {inf.epingle && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-black rounded-full border border-amber-200 flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Épinglé</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{inf.date_publication}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 font-bold">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{inf.auteur}</span>
                  </span>

                  <button
                    onClick={() => togglePinInformation(inf.id)}
                    className="p-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 transition-colors"
                    title={inf.epingle ? 'Désépingler' : 'Épingler'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${inf.epingle ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-display font-black text-base text-slate-900 mb-1.5">{inf.titre}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{inf.contenu}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Info Modal */}
      <InfoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

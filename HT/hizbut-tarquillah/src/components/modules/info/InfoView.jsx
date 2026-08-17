import React, { useState } from 'react';
import { Megaphone, Plus, Pin, Calendar, User, Search, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { InfoModal } from './InfoModal';
import bgInfo from '../../../assets/images/bg_info.jpg';

export const InfoView = () => {
  const { informations, togglePinInformation } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInfos = informations.filter((inf) => {
    const matchesCategory =
      selectedCategory === 'all' || inf.categorie === selectedCategory;
    const matchesSearch =
      inf.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-8 animate-fade-in select-none">
      {/* Hero Banner Style Accueil with Image 1771881788502.jpg */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-ht-line">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgInfo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ht-ink/95 via-ht-ink/80 to-ht-emerald/50 backdrop-blur-[1px]" />

        <div className="relative z-10 p-8 sm:p-12 text-white max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-ht-mint">
            <Megaphone className="w-4 h-4 text-ht-mint" />
            <span>Communiqués & Actualités Hizbut-Tarqiyyah</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight">
            Informations & Annonces Générales
          </h1>

          <p className="text-sm text-gray-200 leading-relaxed">
            Retrouvez l’ensemble des convocations officielles, programmes d’activités, notes d’organisation et annonces importantes pour l’association.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 transform"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un communiqué</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-ht-line shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink focus:outline-none focus:border-ht-fern"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ht-emerald" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-ht-page border border-ht-line rounded-xl text-xs text-ht-ink font-semibold focus:outline-none focus:border-ht-fern"
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
        <h3 className="font-display font-bold text-xl text-ht-ink flex items-center gap-2">
          <span>Publications Récentes</span>
          <span className="text-xs text-ht-sage font-normal">({filteredInfos.length} annonces disponibles)</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {filteredInfos.map((inf) => (
            <div
              key={inf.id}
              className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4 hover:border-ht-mint transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ht-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    {inf.categorie}
                  </span>
                  {inf.epingle && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200 flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-600" />
                      <span>Épinglé</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-ht-sage font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{inf.date_publication}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{inf.auteur}</span>
                  </span>

                  <button
                    onClick={() => togglePinInformation(inf.id)}
                    className="p-1 rounded bg-ht-page hover:bg-ht-mist text-ht-sage hover:text-ht-emerald transition-colors"
                    title={inf.epingle ? 'Désépingler' : 'Épingler'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${inf.epingle ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl text-ht-ink mb-2">{inf.titre}</h4>
                <p className="text-sm text-ht-inkSoft leading-relaxed">{inf.contenu}</p>
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

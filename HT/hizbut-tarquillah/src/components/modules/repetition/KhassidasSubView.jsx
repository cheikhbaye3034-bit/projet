import React, { useState } from 'react';
import { BookOpen, Search, Clock, FileText, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidaModal } from './KhassidaModal';

export const KhassidasSubView = () => {
  const { khassidas, deleteKhassida, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredKhassidas = khassidas.filter((kh) => {
    return (
      kh.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kh.auteur.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (id, titre) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la Khassida "${titre}" ?`)) {
      deleteKhassida(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-ht-line shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une Khassida au programme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald font-semibold"
          />
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs text-ht-sage font-medium hidden md:inline">
            <strong className="text-ht-ink">{filteredKhassidas.length}</strong> Khassida(s)
          </span>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-anim px-5 py-2.5 gradient-emerald text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Khassida</span>
          </button>
        </div>
      </div>

      {/* Grid of Khassida Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredKhassidas.length > 0 ? (
          filteredKhassidas.map((kh) => (
            <div
              key={kh.id}
              className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft hover:shadow-lg hover:border-ht-mint transition-all duration-200 flex flex-col justify-between space-y-5 group relative"
            >
              {/* Header: Icon, Duration Badges & Delete Button */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center border border-ht-mint font-bold shadow-xs">
                  <BookOpen className="w-5 h-5 text-ht-emerald" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ht-sage bg-ht-page px-3 py-1 rounded-full border border-ht-line">
                    <Clock className="w-3.5 h-3.5 text-ht-emerald" />
                    <span>{kh.duree_estimee || '20 min'}</span>
                    <span>•</span>
                    <span>{kh.versets_count || 120} versets</span>
                  </div>

                  <button
                    onClick={() => handleDelete(kh.id, kh.titre)}
                    className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-ht-clay border border-red-200 transition-colors"
                    title="Supprimer la Khassida"
                  >
                    <Trash2 className="w-4 h-4 text-ht-clay" />
                  </button>
                </div>
              </div>

              {/* Title & Author */}
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-xl text-ht-ink group-hover:text-ht-emerald transition-colors leading-snug">
                  {kh.titre}
                </h3>
                <p className="text-xs text-ht-emerald font-semibold">
                  {kh.auteur}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-ht-line flex items-center justify-between">
                <button
                  onClick={() => showToast && showToast(`Ouverture des versets de : ${kh.titre}`)}
                  className="btn-anim w-full py-3 gradient-emerald text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ouvrir & Répéter</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-ht-sage text-sm italic">
            Aucune Khassida ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Add Khassida Modal */}
      <KhassidaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

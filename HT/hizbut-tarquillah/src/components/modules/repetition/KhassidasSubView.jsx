import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  Music, 
  Calendar, 
  Check, 
  DownloadCloud, 
  Sparkles,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidaModal } from './KhassidaModal';
import { KhassidaDetailFullView } from './KhassidaDetailFullView';

export const KhassidasSubView = () => {
  const { khassidas, deleteKhassida, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'bess_bi' | 'downloaded' | 'with_audio'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedKhassidaForReading, setSelectedKhassidaForReading] = useState(null);
  const [downloadedKhassidas, setDownloadedKhassidas] = useState({ kh2: true, kh7: true, kh9: true });

  const filteredKhassidas = (khassidas || []).filter((kh) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || (
      (kh.titre && kh.titre.toLowerCase().includes(query)) ||
      (kh.titre_arabe && kh.titre_arabe.includes(query)) ||
      (kh.auteur && kh.auteur.toLowerCase().includes(query))
    );

    if (!matchesQuery) return false;

    if (selectedFilter === 'bess_bi') return !!kh.is_bess_bi;
    if (selectedFilter === 'downloaded') return !!downloadedKhassidas[kh.id];
    if (selectedFilter === 'with_audio') return (kh.audios_count || 0) > 0;

    return true;
  });

  const handleDelete = (e, id, titre) => {
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la Khassida "${titre}" ?`)) {
      deleteKhassida(id);
    }
  };

  const handleToggleDownload = (e, khId, titre) => {
    e.stopPropagation();
    setDownloadedKhassidas(prev => {
      const isDownloaded = !prev[khId];
      const next = { ...prev, [khId]: !isDownloaded };
      if (!isDownloaded) {
        showToast && showToast(`"${titre}" téléchargé pour consultation hors-ligne.`);
      } else {
        showToast && showToast(`"${titre}" retiré du stockage local.`, 'info');
      }
      return next;
    });
  };

  // If a Khassida is selected, open the full-page reader view
  if (selectedKhassidaForReading) {
    return (
      <div className="pb-12 animate-fade-in">
        <KhassidaDetailFullView
          khassida={selectedKhassidaForReading}
          onClose={() => setSelectedKhassidaForReading(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in select-none">
      
      {/* ── Top Header & Search Bar ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une Khassida (titre latin, arabe, auteur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">
              <strong className="text-slate-900">{filteredKhassidas.length}</strong> Khassida(s)
            </span>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Khassida</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Grid of Khassida Cards (Modern, Light & Refined Aesthetic) ── */}
      <div className="space-y-2.5">
        {filteredKhassidas.length > 0 ? (
          filteredKhassidas.map((kh) => {
            const isDownloaded = !downloadedKhassidas[kh.id];
            const isBessBi = !kh.is_bess_bi;

            return (
              <div
                key={kh.id}
                onClick={() => setSelectedKhassidaForReading(kh)}
                className={`group relative bg-white rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 ${
                  isBessBi 
                    ? 'border-l-4 border-l-emerald-600 border-slate-200/90 bg-gradient-to-r from-emerald-50/20 via-white to-white' 
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Medallion + Titles & Meta */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    
                    {/* Compact Icon Badge */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isBessBi 
                        ? 'bg-emerald-800 text-emerald-200 shadow-xs' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    }`}>
                      <BookOpen className="w-5 h-5 stroke-[2]" />
                    </div>

                    {/* Titles and Subtitle */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isBessBi && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300/50">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Bess Bi</span>
                          </span>
                        )}

                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {kh.niveau || 'Intermédiaire'}
                        </span>
                      </div>

                      {/* Latin Title & Arabic Calligraphy */}
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                        <h3 className="font-display font-black text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                          {kh.titre}
                        </h3>
                        {kh.titre_arabe && (
                          <span className="font-serif text-base sm:text-lg font-bold text-emerald-700 font-['Amiri',serif]">
                            {kh.titre_arabe}
                          </span>
                        )}
                      </div>

                      {/* Metadata Chips (Light & Compact) */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-slate-500 font-medium">
                        <span className="text-slate-600 font-semibold">{kh.pages_count || 2} pages</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">1.2 Mo</span>
                        <span>•</span>
                        <span>{kh.versets_count || 64} versets</span>
                        <span>•</span>
                        <span className="text-slate-400">{kh.duree_estimee || '15 min'}</span>
                      </div>

                    </div>

                  </div>

                  {/* Right Actions: Read + Download + Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {/* Read Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKhassidaForReading(kh);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lire</span>
                    </button>

                    {/* Download / Saved Button */}
                    {isDownloaded ? (
                      <button
                        onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                        title="Enregistré hors-ligne"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span className="text-[10px]">Prêt</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                        className="p-1.5 text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                        title="Télécharger hors-ligne"
                      >
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(e, kh.id, kh.titre)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Supprimer la Khassida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm italic">
            Aucune Khassida ne correspond aux filtres sélectionnés.
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

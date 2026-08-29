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
  X,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidaModal } from './KhassidaModal';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

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

  return (
    <div className="space-y-5 animate-fade-in select-none">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">
              <strong className="text-slate-900">{filteredKhassidas.length}</strong> Khassida(s)
            </span>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Khassida</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Khassida Cards (Modern Refined Aesthetic) */}
      <div className="space-y-3 sm:space-y-4">
        {filteredKhassidas.length > 0 ? (
          filteredKhassidas.map((kh) => {
            const isDownloaded = !downloadedKhassidas[kh.id];
            const isBessBi = !kh.is_bess_bi;

            return (
              <div
                key={kh.id}
                onClick={() => setSelectedKhassidaForReading(kh)}
                className={`group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(16,91,60,0.09)] hover:-translate-y-0.5 ${
                  isBessBi 
                    ? 'border-l-[6px] border-l-emerald-600 border-slate-200/90 bg-gradient-to-r from-emerald-50/30 via-white to-white' 
                    : 'border-slate-200/90 hover:border-emerald-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Emblem + Titles & Calligraphy */}
                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                    
                    {/* Islamic Medallion / Icon Badge */}
                    <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 transition-transform group-hover:scale-105 shadow-xs ${
                      isBessBi 
                        ? 'bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-200 border border-emerald-600/40' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                    }`}>
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                    </div>

                    {/* Main Title & Subtitle */}
                    <div className="min-w-0 flex-1 space-y-1">
                      
                      {/* Top Meta Chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isBessBi && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300/60">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Khassida Bess Bi</span>
                          </span>
                        )}

                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {kh.niveau || 'Intermédiaire'}
                        </span>

                        <span className="text-[10px] font-medium text-slate-400 hidden md:inline">
                          {kh.auteur || 'Cheikh Ahmadou Bamba'}
                        </span>
                      </div>

                      {/* Latin Title (Bold & Clean) */}
                      <h3 className="font-display font-black text-base sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug truncate">
                        {kh.titre}
                      </h3>

                      {/* Arabic Title (Calligraphy with Amiri Font in Emerald Green) */}
                      {kh.titre_arabe && (
                        <p className="font-serif text-lg sm:text-2xl font-bold text-emerald-700 font-['Amiri',serif] leading-tight tracking-wide">
                          {kh.titre_arabe}
                        </p>
                      )}

                      {/* Metadata Pills Row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1.5 text-xs text-slate-500 font-medium">
                        
                        {/* 📄 Page count */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="font-semibold text-slate-700">{kh.pages_count || 3} pages</span>
                        </div>

                        {/* 🎵 Audio count */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <Music className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="font-semibold text-slate-700">{kh.audios_count || 0} audio(s)</span>
                        </div>

                        {/* ⏱️ Versets / Durée */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600">{kh.duree_estimee || '20 min'}</span>
                        </div>

                        {/* 👁️ Views */}
                        <div className="inline-flex items-center gap-1 text-slate-400 text-[11px] ml-auto sm:ml-0">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{kh.vues_count || 0}</span>
                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Right Actions: Read + Download + Delete */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {/* Read Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKhassidaForReading(kh);
                      }}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lire</span>
                    </button>

                    {/* Download / Saved Button */}
                    {isDownloaded ? (
                      <button
                        onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                        className="px-3 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        title="Téléchargé hors-ligne"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Enregistré</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                        className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                        title="Télécharger"
                      >
                        <DownloadCloud className="w-5 h-5 text-slate-600 hover:text-emerald-700" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(e, kh.id, kh.titre)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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

      {/* Reader Modal */}
      {selectedKhassidaForReading && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-text">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header with Hero Background Banner */}
            <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center" 
                style={{ backgroundImage: `url(${heroMicBg})` }}
              />
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  Texte Intégral & Paroles
                </span>
                <h3 className="font-display font-black text-lg sm:text-xl text-white mt-0.5">
                  {selectedKhassidaForReading.titre}
                </h3>
                {selectedKhassidaForReading.titre_arabe && (
                  <p className="font-serif text-emerald-300 text-lg font-bold font-['Amiri',serif]">
                    {selectedKhassidaForReading.titre_arabe}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => setSelectedKhassidaForReading(null)}
                className="relative z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Arab Verses + Translation */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-800 leading-relaxed font-sans text-sm sm:text-base">
              
              <div className="text-center py-3 border-b border-slate-100">
                <span className="font-serif text-2xl sm:text-3xl text-emerald-950 font-bold font-['Amiri',serif]">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>

              <div className="space-y-4">
                
                <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 space-y-2">
                  <p className="font-serif text-xl sm:text-2xl text-emerald-950 leading-loose text-right font-['Amiri',serif]" dir="rtl">
                    يَا رَبِّ بِالْمُصْطَفَى بَلِّغْ مَقَاصِدَنَا • وَاغْفِرْ لَنَا مَا مَضَى يَا وَاسِعَ الْكَرَمِ
                  </p>
                  <p className="text-xs text-emerald-800 font-semibold font-mono">
                    Yâ Rabbi bil Mustafâ balligh maqâssidanâ • Waghfir lanâ mâ madâ yâ wâssi'al karami
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    « Ô Seigneur ! Par l'Élu (Mouhammad PSL), exauce nos desseins, et pardonne-nous nos fautes passées, Ô Toi dont la générosité est infinie. »
                  </p>
                </div>

                <div className="bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200/70 space-y-2">
                  <p className="font-serif text-xl sm:text-2xl text-emerald-950 leading-loose text-right font-['Amiri',serif]" dir="rtl">
                    حَمِدْتُ مَنْ جَلَّ عَنِ الشَّرِيكِ • وَقَادَنِي لِلْمَسْلَكِ السَّالِيكِ
                  </p>
                  <p className="text-xs text-emerald-800 font-semibold font-mono">
                    Hamidtu man jalla 'anich-charîki • Wa qâdanî lil maslakis-sâlîki
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    « Je rends grâce à Celui qui est exempt de tout associé, et qui m'a guidé sur la voie droite et pure. »
                  </p>
                </div>

                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-serif text-xl sm:text-2xl text-emerald-950 leading-loose text-right font-['Amiri',serif]" dir="rtl">
                    فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ
                  </p>
                  <p className="text-xs text-slate-700 font-semibold font-mono">
                    Fa-sayakfîkahumul Lâhu wa huwas-samî'ul 'alîm
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    « Allah te suffira contre eux, et c'est Lui l'Audient, l'Omniscient. »
                  </p>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                {selectedKhassidaForReading.versets_count || 72} versets • {selectedKhassidaForReading.pages_count || 3} pages
              </span>
              
              <button
                onClick={() => setSelectedKhassidaForReading(null)}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

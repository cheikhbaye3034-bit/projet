import React, { useState, useRef } from 'react';
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
  Sparkle,
  Upload
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidaModal } from './KhassidaModal';
import { KhassidaDetailFullView } from './KhassidaDetailFullView';

export const KhassidasSubView = () => {
  const { khassidas, addKhassida, deleteKhassida, showToast } = useApp();
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'bess_bi' | 'downloaded' | 'with_audio'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedKhassidaForReading, setSelectedKhassidaForReading] = useState(null);
  const [downloadedKhassidas, setDownloadedKhassidas] = useState({ kh2: true, kh7: true, kh9: true });

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Extract clean title from filename
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const fileBlobUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;

      const newKhassida = {
        titre: cleanTitle.toUpperCase(),
        titre_arabe: '',
        date_ajout: formattedDate,
        auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul',
        file_url: fileBlobUrl,
        file_data_url: dataUrl,
        file_name: file.name,
        file_type: file.type || 'application/pdf',
        file_size: (file.size / (1024 * 1024)).toFixed(1) + ' Mo',
        pages_count: 5,
        versets_count: 60,
        duree_estimee: '15 min',
        is_bess_bi: false
      };

      addKhassida(newKhassida);
      showToast && showToast(`✅ Khassida "${cleanTitle}" importée avec succès depuis votre appareil !`);
    };

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const textReader = new FileReader();
      textReader.onload = (tEvt) => {
        const textContent = tEvt.target?.result;
        const newKhassida = {
          titre: cleanTitle.toUpperCase(),
          titre_arabe: '',
          date_ajout: formattedDate,
          auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul',
          file_url: fileBlobUrl,
          file_name: file.name,
          text_content: textContent,
          file_type: 'text/plain',
          file_size: (file.size / (1024 * 1024)).toFixed(1) + ' Mo',
          pages_count: 1,
          versets_count: 10,
          duree_estimee: '10 min',
          is_bess_bi: false
        };
        addKhassida(newKhassida);
        showToast && showToast(`✅ Khassida "${cleanTitle}" importée avec succès !`);
      };
      textReader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

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

      {/* Hidden Native File Input for Direct Device / Phone File Manager */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword"
        className="hidden"
      />
      
      {/* ── Top Header & Search Bar (Rich Emerald / Forest Palette) ── */}
      <div className="bg-[#072418] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-emerald-800/60 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Chercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D3625] border border-emerald-700/60 rounded-xl text-xs sm:text-sm text-white placeholder:text-emerald-300/60 focus:outline-none focus:border-amber-400 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <span className="text-xs text-emerald-200/90 font-medium px-2">
            <strong className="text-white">{filteredKhassidas.length}</strong> Khassida(s)
          </span>

          <button
            type="button"
            onClick={handleTriggerFileInput}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 transition-all border border-emerald-400/30"
            title="Sélectionner un fichier PDF / Document depuis votre appareil"
          >
            <Upload className="w-4 h-4" />
            <span>Ajouter une Khassida</span>
          </button>
        </div>
      </div>

      {/* ── List of Khassida Cards (Exquisite Deep Islamic Emerald Green) ── */}
      <div className="space-y-2.5">
        {filteredKhassidas.length > 0 ? (
          filteredKhassidas.map((kh) => {
            return (
              <div
                key={kh.id}
                onClick={() => setSelectedKhassidaForReading(kh)}
                className="group relative bg-gradient-to-r from-[#092B1D] via-[#0E3827] to-[#0A2D1F] hover:from-[#0E3D2B] hover:to-[#0F422E] rounded-2xl p-4 sm:p-5 border border-emerald-800/50 hover:border-emerald-400/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left: Title & Date Only */}
                  <div className="min-w-0 flex-1 space-y-2">
                    
                    {/* Main Title (Clean, Bold, Uppercase) */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-wide uppercase group-hover:text-amber-300 transition-colors">
                        {kh.titre}
                      </h3>
                      {kh.titre_arabe && (
                        <span className="font-serif text-sm sm:text-base font-bold text-amber-300/95 font-['Amiri',serif]">
                          {kh.titre_arabe}
                        </span>
                      )}
                    </div>

                    {/* Single Date Pill Badge in Emerald */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13422F] border border-emerald-700/60 text-[11px] sm:text-xs font-semibold text-emerald-100 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{kh.date_ajout || '01/10/2024'}</span>
                      </span>

                      {kh.is_bess_bi && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>Bess Bi</span>
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedKhassidaForReading(kh);
                      }}
                      className="px-3.5 py-1.5 bg-[#13422F] hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-xl border border-emerald-600/50 text-xs font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lire</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, kh.id, kh.titre)}
                      className="p-2 text-emerald-300 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
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
          <div className="p-10 sm:p-14 text-center bg-[#072418] rounded-3xl border border-emerald-800/60 text-emerald-200/90 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center mx-auto text-emerald-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="font-display font-bold text-base text-white">
              {searchQuery ? 'Aucune Khassida ne correspond à votre recherche.' : 'Aucune Khassida dans le répertoire'}
            </h4>
            <p className="text-xs text-emerald-300/70 max-w-md mx-auto leading-relaxed">
              {searchQuery ? 'Essayez un autre mot-clé ou réinitialisez la recherche.' : 'Cliquez sur « Ajouter une Khassida » pour sélectionner et importer vos fichiers PDF ou documents directement depuis votre appareil.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={handleTriggerFileInput}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-md mt-2"
              >
                <Upload className="w-4 h-4" />
                <span>Importer une Khassida depuis votre appareil</span>
              </button>
            )}
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

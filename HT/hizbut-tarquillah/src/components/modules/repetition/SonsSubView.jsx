import React, { useState, useRef } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  DownloadCloud, 
  Clock, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  Check,
  Disc,
  Upload
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AudioModal } from './AudioModal';

export const SonsSubView = () => {
  const { sonsAudio, addSonAudio, deleteSonAudio, showToast } = useApp();
  const audioInputRef = useRef(null);
  const [playingSonId, setPlayingSonId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioProgress, setAudioProgress] = useState(35);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handleTriggerAudioInput = () => {
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
      audioInputRef.current.click();
    }
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Protection anti-déni de service mémoire (taille maximale de 20 Mo)
    const MAX_AUDIO_SIZE_MB = 20;
    if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      showToast && showToast(`⚠️ Le fichier audio est trop lourd (maximum ${MAX_AUDIO_SIZE_MB} Mo autorisé).`, 'error');
      return;
    }

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    const formattedDate = new Date().toISOString().split('T')[0];

    const newAudio = {
      titre: cleanTitle,
      titre_arabe: '',
      recitateur: 'Kourel Officiel Hizbut-Tarqiyyah',
      duree: '08:45',
      date: formattedDate,
      taille: (file.size / (1024 * 1024)).toFixed(1) + ' Mo',
      url: URL.createObjectURL(file),
      kourel_id: 'k1',
      audio_officiel: true,
      format: file.type || 'audio/mp3'
    };

    addSonAudio(newAudio);
    showToast && showToast(`🎙️ Piste audio "${cleanTitle}" importée directement depuis votre appareil !`);
  };

  const filteredSons = (sonsAudio || []).filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (s.titre && s.titre.toLowerCase().includes(query)) ||
      (s.titre_arabe && s.titre_arabe.includes(query)) ||
      (s.recitateur && s.recitateur.toLowerCase().includes(query))
    );
  });

  const togglePlay = (id) => {
    if (playingSonId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSonId(id);
      setIsPlaying(true);
    }
  };

  const handleDelete = (e, id, titre) => {
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'audio de référence "${titre}" ?`)) {
      deleteSonAudio(id);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in select-none">

      {/* Hidden Native File Input for Direct Audio File Picker */}
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleAudioFileUpload}
        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.flac"
        className="hidden"
      />
      
      {/* ── Header & Search Toolbar ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un enregistrement audio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold"
            />
          </div>

          <div className="flex items-center gap-2.5 justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">
              <strong className="text-slate-900">{filteredSons.length}</strong> Piste(s)
            </span>

            <button
              type="button"
              onClick={handleTriggerAudioInput}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              title="Sélectionner un fichier audio MP3 / M4A depuis votre appareil"
            >
              <Upload className="w-4 h-4" />
              <span>Ajouter un Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Audio Tracks List (Compact, Clean & Elegant) ── */}
      <div className="space-y-2.5">
        {filteredSons.length > 0 ? (
          filteredSons.map((son) => {
            const isCurrent = playingSonId === son.id;
            const isCurrentlyPlaying = isCurrent && isPlaying;

            return (
              <div
                key={son.id}
                onClick={() => togglePlay(son.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 cursor-pointer shadow-xs hover:shadow-md ${
                  isCurrent 
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/25' 
                    : 'border-slate-200/90 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(son.id);
                      }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-xs active:scale-90 flex-shrink-0 cursor-pointer ${
                        isCurrentlyPlaying
                          ? 'bg-emerald-800 text-white animate-pulse'
                          : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isCurrentlyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 truncate">
                          {son.titre}
                        </h4>
                        {son.titre_arabe && (
                          <span className="font-serif text-sm sm:text-base font-bold text-emerald-700 font-['Amiri',serif]">
                            {son.titre_arabe}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span>Récitateur : <strong className="text-slate-800">{son.recitateur}</strong></span>
                        <span>•</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                          {son.taille || '2.1 Mo'}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{son.duree}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <a
                      href={son.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                      title="Télécharger l'audio"
                    >
                      <DownloadCloud className="w-4 h-4" />
                    </a>

                    <button
                      onClick={(e) => handleDelete(e, son.id, son.titre)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
                      title="Supprimer l'audio de référence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Audio Player Bar when Active */}
                {isCurrent && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="pt-2 border-t border-emerald-200/60 space-y-1.5 animate-fade-in"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span>04:35</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                          {isCurrentlyPlaying ? 'Lecture en cours' : 'En pause'}
                        </span>
                        <button 
                          onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                          className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded text-[9px] font-extrabold cursor-pointer hover:bg-emerald-200 transition-colors"
                        >
                          x{playbackSpeed}
                        </button>
                      </div>
                      <span>{son.duree}</span>
                    </div>
                    
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = ((e.clientX - rect.left) / rect.width) * 100;
                        setAudioProgress(Math.min(100, Math.max(0, pos)));
                      }}
                      className="w-full h-2 bg-slate-200/80 hover:bg-slate-300 rounded-full overflow-hidden cursor-pointer relative"
                    >
                      <div 
                        className="h-full bg-emerald-700 rounded-full transition-all duration-150"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm italic">
            Aucun audio de référence disponible pour cette recherche.
          </div>
        )}
      </div>

      {/* Add Audio Modal */}
      <AudioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Clock, 
  Disc, 
  Plus, 
  Trash2, 
  FileText, 
  Eye, 
  Calendar, 
  Search, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AudioModal } from './AudioModal';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const SonsSubView = () => {
  const { sonsAudio, deleteSonAudio, showToast } = useApp();
  const [playingSonId, setPlayingSonId] = useState(sonsAudio[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioProgress, setAudioProgress] = useState(42);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const activeSon = sonsAudio.find((s) => s.id === playingSonId) || sonsAudio[0];

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
    <div className="space-y-5 sm:space-y-6 animate-fade-in select-none">
      
      {/* Featured Main Audio Player Header Card with Background Image */}
      {activeSon && (
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-500/30 text-white p-6 sm:p-8 space-y-6">
          
          {/* Background Image with Dark Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-slate-950/90 to-emerald-900/90 backdrop-blur-[2px]" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-lg border border-emerald-600/40 flex-shrink-0">
                <Disc className={`w-7 h-7 sm:w-8 sm:h-8 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest block">
                  Audio de Référence • Kourel Officiel
                </span>
                <h3 className="font-display font-black text-lg sm:text-2xl text-white mt-0.5 truncate">
                  {activeSon.titre}
                </h3>
                {activeSon.titre_arabe && (
                  <p className="font-serif text-emerald-300 text-base sm:text-lg font-bold font-['Amiri',serif]">
                    {activeSon.titre_arabe}
                  </p>
                )}
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Récitateur : <span className="text-emerald-200 font-bold">{activeSon.recitateur}</span> • {activeSon.qualite} • {activeSon.taille}
                </p>
              </div>
            </div>

            {/* Main Play/Pause Button */}
            <button
              onClick={() => togglePlay(activeSon.id)}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all self-end sm:self-center cursor-pointer border border-white/30 flex-shrink-0"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Progress Bar & Audio Player Controls */}
          <div className="relative z-10 space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>04:35</span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-300 text-[11px] font-bold">Lecture en direct</span>
                <button 
                  onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                  className="px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                >
                  x{playbackSpeed}
                </button>
              </div>
              <span>{activeSon.duree}</span>
            </div>
            
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setAudioProgress(Math.min(100, Math.max(0, pos)));
              }}
              className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>

        </div>
      )}

      {/* List of Audio Reference Tracks Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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

          {/* CTA Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Audio</span>
          </button>
        </div>

        {/* Audio Track List (Kaggu Green Theme) */}
        <div className="space-y-3 pt-1">
          {filteredSons.length > 0 ? (
            filteredSons.map((son) => {
              const isCurrent = playingSonId === son.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={son.id}
                  onClick={() => togglePlay(son.id)}
                  className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer ${
                    isCurrent 
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md' 
                      : 'border-slate-200/90 hover:border-emerald-300/80 bg-white shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(son.id);
                      }}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 flex-shrink-0 cursor-pointer ${
                        isCurrentlyPlaying
                          ? 'bg-emerald-800 text-white animate-pulse'
                          : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isCurrentlyPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0 flex-1 space-y-1">
                      <h4 className="font-display font-black text-sm sm:text-base text-slate-900 truncate">
                        {son.titre}
                      </h4>
                      {son.titre_arabe && (
                        <p className="font-serif text-emerald-700 font-bold text-sm font-['Amiri',serif]">
                          {son.titre_arabe}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>Récitateur : <strong className="text-slate-800">{son.recitateur}</strong></span>
                        <span>•</span>
                        <span>{son.qualite}</span>
                        <span>•</span>
                        <span>{son.taille}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      {son.duree}
                    </span>
                    <a
                      href={son.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                      title="Télécharger l'audio"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={(e) => handleDelete(e, son.id, son.titre)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
                      title="Supprimer l'audio de référence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm italic">
              Aucun audio de référence disponible pour cette recherche.
            </div>
          )}
        </div>
      </div>

      {/* Add Audio Modal */}
      <AudioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Mic, 
  Calendar, 
  Clock, 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  FileText, 
  Sparkles, 
  Check, 
  User, 
  ChevronRight,
  X,
  Search,
  Eye,
  Music,
  DownloadCloud,
  CheckCircle2,
  Disc,
  Bookmark,
  Layers,
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { MembreAbsenceSection } from './MembreAbsenceSection';
import { KhassidaDetailFullView } from '../repetition/KhassidaDetailFullView';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const MembreRepetitionTab = () => {
  const { currentUser, seances, khassidas, sonsAudio, kourels, showToast } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState('khassidas'); // 'khassidas' | 'audios' | 'enregistrements' | 'absences'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'bess_bi' | 'downloaded' | 'with_audio'
  const [selectedKhassidaForReading, setSelectedKhassidaForReading] = useState(null);
  const [downloadedKhassidas, setDownloadedKhassidas] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_downloaded_khassidas');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {};
  });
  
  // Audio Player State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Past recordings
  const pastRecordings = (seances || []).filter(s => (!currentUser?.kourel_id || s.kourel_id === currentUser.kourel_id) && s.recording_url);

  // Filtered Khassidas
  const filteredKhassidas = (khassidas || []).filter(kh => {
    // Search query filter
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || (
      (kh.titre && kh.titre.toLowerCase().includes(query)) ||
      (kh.titre_arabe && kh.titre_arabe.includes(query)) ||
      (kh.auteur && kh.auteur.toLowerCase().includes(query))
    );

    if (!matchesQuery) return false;

    // Category filter
    if (selectedFilter === 'bess_bi') return !!kh.is_bess_bi;
    if (selectedFilter === 'downloaded') return !!downloadedKhassidas[kh.id];
    if (selectedFilter === 'with_audio') return (kh.audios_count || 0) > 0;

    return true;
  });

  const handleTogglePlay = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
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
    <div className="space-y-5 sm:space-y-7 animate-fade-in pb-16 select-none relative">
      
      {/* =========================================================================
          BARRE DE RECHERCHE ET ONGLETS PRINCIPAUX
      ========================================================================= */}
      <div className="space-y-4">
        
        {/* Search Input Bar (Kaggu PDF Style with Islamic Emerald Theme) */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Chercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#072418] border border-emerald-800/60 rounded-2xl text-xs sm:text-sm text-white placeholder:text-emerald-300/60 focus:outline-none focus:border-amber-400 shadow-md font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-emerald-300 hover:text-white rounded-full hover:bg-emerald-800/50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sub-tabs Selector Pill (Responsive) */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-300/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('khassidas')}
            className={`flex-1 min-w-[120px] py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'khassidas'
                ? 'bg-emerald-800 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Khassidas ({khassidas?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audios')}
            className={`flex-1 min-w-[120px] py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'audios'
                ? 'bg-emerald-800 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audios Référence ({sonsAudio.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('enregistrements')}
            className={`flex-1 min-w-[120px] py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'enregistrements'
                ? 'bg-emerald-800 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Enregistrements ({pastRecordings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('absences')}
            className={`flex-1 min-w-[120px] py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'absences'
                ? 'bg-amber-700 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Absences</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          SECTION 1 : DESIGN KAGGU PDF (VERT ÉMERAUDE PROFOND & BADGE DATE UNIQUE)
      ========================================================================= */}
      {activeSubTab === 'khassidas' && (
        <div className="space-y-2.5 animate-fade-in">
          {filteredKhassidas.length > 0 ? (
            filteredKhassidas.map((kh) => {
              const isDownloaded = !downloadedKhassidas[kh.id];

              return (
                <div
                  key={kh.id}
                  onClick={() => setSelectedKhassidaForReading(kh)}
                  className="group relative bg-gradient-to-r from-[#092B1D] via-[#0E3827] to-[#0A2D1F] hover:from-[#0E3D2B] hover:to-[#0F422E] rounded-2xl p-4 sm:p-5 border border-emerald-800/50 hover:border-emerald-400/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-3">
                    
                    {/* Left: Title + Date Badge Only */}
                    <div className="min-w-0 flex-1 space-y-2">
                      
                      {/* Main Title (Bold Uppercase) */}
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

                      {/* Single Date Badge Only */}
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

                    {/* Right Actions: Read + Download */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      
                      {/* Read Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKhassidaForReading(kh);
                        }}
                        className="px-3.5 py-1.5 bg-[#13422F] hover:bg-emerald-700 text-emerald-100 hover:text-white font-bold text-xs rounded-xl border border-emerald-600/50 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Lire</span>
                      </button>

                      {/* Download / Saved Button */}
                      {isDownloaded ? (
                        <button
                          onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer border border-emerald-400/30"
                          title="Téléchargé hors-ligne"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="text-[10px]">Prêt</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                          className="p-1.5 text-emerald-300 hover:text-white hover:bg-[#13422F] rounded-xl border border-emerald-700/50 transition-all active:scale-95 cursor-pointer"
                          title="Télécharger pour accès hors-ligne"
                        >
                          <DownloadCloud className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-[#092B1D] rounded-3xl border border-emerald-800/60 text-emerald-200 text-sm italic">
              Aucune Khassida ne correspond à votre recherche.
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 2 : AUDIOS DE RÉFÉRENCE
      ========================================================================= */}
      {activeSubTab === 'audios' && (
        <div className="space-y-3.5 animate-fade-in">
          {sonsAudio.map((audio) => {
            const isPlaying = playingAudioId === audio.id;
            return (
              <div 
                key={audio.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-200 ${
                  isPlaying 
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md' 
                    : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left: Play button & Track Info */}
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => handleTogglePlay(audio.id)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 flex-shrink-0 cursor-pointer ${
                        isPlaying 
                          ? 'bg-emerald-800 text-white animate-pulse' 
                          : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>

                    <div className="min-w-0">
                      <h4 className="font-display font-black text-sm sm:text-base text-slate-900 truncate">
                        {audio.titre}
                      </h4>
                      {audio.titre_arabe && (
                        <p className="font-serif text-emerald-700 font-bold text-sm font-['Amiri',serif]">
                          {audio.titre_arabe}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500 font-semibold mt-0.5">
                        <span>Récitateur : <strong className="text-slate-800">{audio.recitateur}</strong></span>
                        <span>•</span>
                        <span>{audio.qualite}</span>
                        <span>•</span>
                        <span>{audio.taille}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Duration Badge & Download button */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                      {audio.duree}
                    </span>
                    <a
                      href={audio.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                      title="Télécharger l'audio"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>

                </div>

                {/* Live Progress Bar when Playing */}
                {isPlaying && (
                  <div className="mt-4 pt-3.5 border-t border-emerald-100 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>04:35</span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-800 font-bold">Lecture en cours</span>
                        <button 
                          onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                          className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[10px] font-extrabold cursor-pointer hover:bg-emerald-200"
                        >
                          x{playbackSpeed}
                        </button>
                      </div>
                      <span>{audio.duree}</span>
                    </div>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = ((e.clientX - rect.left) / rect.width) * 100;
                        setAudioProgress(Math.min(100, Math.max(0, pos)));
                      }}
                      className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer relative"
                    >
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-150"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          SECTION 3 : ENREGISTREMENTS DES SÉANCES PASSÉES
      ========================================================================= */}
      {activeSubTab === 'enregistrements' && (
        <div className="space-y-3.5 animate-fade-in">
          {pastRecordings.length > 0 ? (
            pastRecordings.map((seance) => (
              <div 
                key={seance.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0 border border-emerald-200/60">
                    <Mic className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-sm sm:text-base text-slate-900">
                      Enregistrement de la séance du {seance.date}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Superviseur : {seance.superviseur} • {seance.notes}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => handleTogglePlay(seance.id)}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {playingAudioId === seance.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{playingAudioId === seance.id ? 'Pause' : 'Écouter'}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-sm italic">
              Aucun enregistrement de séance disponible pour ce kourel.
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 4 : SIGNALEMENT D'ABSENCE
      ========================================================================= */}
      {activeSubTab === 'absences' && (
        <MembreAbsenceSection />
      )}

      {/* =========================================================================
          MODAL DE LECTURE DU TEXTE DE KHASSIDA (AMIRI CALLIGRAPHIE VERT ÉMERAUDE)
      ========================================================================= */}
      {selectedKhassidaForReading && (
        <KhassidaDetailFullView
          khassida={selectedKhassidaForReading}
          onClose={() => setSelectedKhassidaForReading(null)}
        />
      )}

    </div>
  );
};

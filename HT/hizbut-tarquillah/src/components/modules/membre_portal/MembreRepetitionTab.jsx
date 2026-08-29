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
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const MembreRepetitionTab = () => {
  const { currentUser, seances, khassidas, sonsAudio, kourels, showToast } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState('khassidas'); // 'khassidas' | 'audios' | 'enregistrements'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'bess_bi' | 'downloaded' | 'with_audio'
  const [selectedKhassidaForReading, setSelectedKhassidaForReading] = useState(null);
  const [downloadedKhassidas, setDownloadedKhassidas] = useState({ kh2: true, kh7: true, kh9: true });
  
  // Audio Player State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(38);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Past recordings
  const pastRecordings = seances.filter(s => s.kourel_id === (currentUser?.kourel_id || 'k1') && s.recording_url);

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
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une Khassida (ex: Fa-sayakfîkahumul, Achkurul lâha, فسيكفيهم...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 shadow-soft-xs font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
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
        </div>

      </div>

      {/* =========================================================================
          SECTION 1 : NOUVEAU DESIGN ÉLÉGANT DES CARTES KHASSIDAS
      ========================================================================= */}
      {activeSubTab === 'khassidas' && (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          {filteredKhassidas.length > 0 ? (
            filteredKhassidas.map((kh, index) => {
              const isDownloaded = !!downloadedKhassidas[kh.id];
              const isBessBi = !!kh.is_bess_bi;

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
                        
                        {/* Top Meta Chips (Bess Bi, Level, Author) */}
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

                    {/* Right Actions: Read CTA + Download Button */}
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
                          title="Téléchargé hors-ligne • Cliquez pour retirer"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Enregistré</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleToggleDownload(e, kh.id, kh.titre)}
                          className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                          title="Télécharger pour accès hors-ligne"
                        >
                          <DownloadCloud className="w-5 h-5 text-slate-600 hover:text-emerald-700" />
                        </button>
                      )}

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
          MODAL DE LECTURE DU TEXTE DE KHASSIDA (AMIRI CALLIGRAPHIE VERT ÉMERAUDE)
      ========================================================================= */}
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
                
                {/* Couplet 1 */}
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

                {/* Couplet 2 */}
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

                {/* Couplet 3 */}
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
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedKhassidaForReading(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Fermer
                </button>

                <button
                  onClick={() => {
                    showToast && showToast(`Khassida "${selectedKhassidaForReading.titre}" prête pour la répétition !`);
                    setSelectedKhassidaForReading(null);
                  }}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow"
                >
                  Valider
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

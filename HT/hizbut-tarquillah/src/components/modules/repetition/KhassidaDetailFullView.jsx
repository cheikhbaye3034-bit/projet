import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Music, 
  Clock, 
  FileText, 
  DownloadCloud, 
  Check, 
  Share2, 
  Printer, 
  Search, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  SlidersHorizontal,
  Bookmark,
  Layers,
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const KhassidaDetailFullView = ({ khassida, onClose }) => {
  const { sonsAudio, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('texte'); // 'texte' | 'audios' | 'infos'
  const [fontSizeLevel, setFontSizeLevel] = useState(2); // 1: small, 2: medium, 3: large, 4: x-large
  const [verseSearch, setVerseSearch] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(khassida.telecharge || false);
  const [playingSonId, setPlayingSonId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Associated audio tracks for this khassida
  const associatedAudios = (sonsAudio || []).filter(
    (s) => s.khassida_id === khassida.id || (s.titre && s.titre.toLowerCase().includes(khassida.titre.toLowerCase()))
  );

  // Verses content generator based on khassida
  const getVerses = () => {
    return [
      {
        num: 1,
        arabe: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        phonetique: "Bismi-Llâhir-Rahmânir-Rahîmi",
        traduction: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
        isBasmalah: true
      },
      {
        num: 2,
        arabe: "يَا رَبِّ بِالْمُصْطَفَى بَلِّغْ مَقَاصِدَنَا • وَاغْفِرْ لَنَا مَا مَضَى يَا وَاسِعَ الْكَرَمِ",
        phonetique: "Yâ Rabbi bil Mustafâ balligh maqâssidanâ • Waghfir lanâ mâ madâ yâ wâssi'al karami",
        traduction: "Ô Seigneur ! Par l'Élu (Mouhammad PSL), exauce nos desseins, et pardonne-nous nos fautes passées, Ô Toi dont la générosité est infinie."
      },
      {
        num: 3,
        arabe: "حَمِدْتُ مَنْ جَلَّ عَنِ الشَّرِيكِ • وَقَادَنِي لِلْمَسْلَكِ السَّالِيكِ",
        phonetique: "Hamidtu man jalla 'anich-charîki • Wa qâdanî lil maslakis-sâlîki",
        traduction: "Je rends grâce à Celui qui est exempt de tout associé, et qui m'a guidé sur la voie droite et pure."
      },
      {
        num: 4,
        arabe: "فَسَيَكْفِيكَهُمُ اللَّهُ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        phonetique: "Fa-sayakfîkahumul Lâhu wa huwas-samî'ul 'alîm",
        traduction: "Allah te suffira contre eux, et c'est Lui l'Audient, l'Omniscient."
      },
      {
        num: 5,
        arabe: "شَكَرْتُ رَبِّي وَلَهُ التَّحْمِيدُ • حَمْدًا بِهِ تَنْزِلُ الْمَزِيدُ",
        phonetique: "Chakartu Rabbî wa lahut-tahmîdu • Hamdan bihî tanzilul mazîdu",
        traduction: "J'ai remercié mon Seigneur, à Lui reviennent toutes les louanges, une louange par laquelle descendent Ses grâces démultipliées."
      },
      {
        num: 6,
        arabe: "صَلَّى عَلَى خَيْرِ الْوَرَى وَسَلَّمَا • مَا حَنَّ مُشْتَاقٌ إِلَى أُمِّ الْقُرَى",
        phonetique: "Sallâ 'alâ khayril warâ wa sallamâ • Mâ hanna mouchtâqun ilâ Ummil Qurâ",
        traduction: "Que la paix et les bénédictions d'Allah soient sur la meilleure des créatures, tant qu'un être épris éprouvera de la nostalgie envers la Cité Mère (La Mecque)."
      }
    ];
  };

  const verses = getVerses();
  const filteredVerses = verses.filter(v => 
    !verseSearch || 
    v.arabe.includes(verseSearch) || 
    v.phonetique.toLowerCase().includes(verseSearch.toLowerCase()) || 
    v.traduction.toLowerCase().includes(verseSearch.toLowerCase())
  );

  const toggleDownload = () => {
    setIsDownloaded(!isDownloaded);
    if (!isDownloaded) {
      showToast && showToast(`"${khassida.titre}" téléchargé pour consultation hors-ligne.`);
    } else {
      showToast && showToast(`"${khassida.titre}" retiré du cache hors-ligne.`, 'info');
    }
  };

  const togglePlayAudio = (sonId) => {
    if (playingSonId === sonId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSonId(sonId);
      setIsPlaying(true);
    }
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 1: return 'text-xl sm:text-2xl leading-loose';
      case 3: return 'text-3xl sm:text-4xl leading-loose';
      case 4: return 'text-4xl sm:text-5xl leading-loose';
      default: return 'text-2xl sm:text-3xl leading-loose';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* ── Top Action Bar (Back button + Action buttons) ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-soft-xs transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
          <span>Retour au Répertoire des Khassidas</span>
        </button>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={toggleDownload}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
              isDownloaded 
                ? 'bg-emerald-700 text-white' 
                : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200'
            }`}
          >
            {isDownloaded ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isDownloaded ? 'Enregistré' : 'Télécharger (1.2 Mo)'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Imprimer la Khassida"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Grand Spiritual Hero Banner ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-emerald-500/20 text-white p-6 sm:p-8">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroMicBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-[#062418]/95 backdrop-blur-[2px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {khassida.is_bess_bi && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Khassida Bess Bi</span>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 text-[10px] font-bold uppercase tracking-wider">
                Niveau : {khassida.niveau || 'Intermédiaire'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-[10px] font-bold">
                Taille : 1.2 Mo
              </span>
            </div>

            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                {khassida.titre}
              </h1>
              {khassida.titre_arabe && (
                <p className="font-serif text-2xl sm:text-4xl font-bold text-emerald-300 font-['Amiri',serif] mt-1.5">
                  {khassida.titre_arabe}
                </p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/85 font-medium leading-relaxed">
              Auteur : <strong className="text-white">{khassida.auteur || 'Cheikh Ahmadou Bamba Khadimou Rassoul'}</strong>
            </p>
          </div>

          {/* Quick Metrics Summary Cards on Right */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 grid grid-cols-3 gap-4 text-center shrink-0">
            <div>
              <div className="font-display font-black text-lg sm:text-xl text-white">
                {khassida.pages_count || 3}
              </div>
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                Pages
              </div>
            </div>
            <div className="border-x border-white/15 px-3">
              <div className="font-display font-black text-lg sm:text-xl text-emerald-300">
                {khassida.versets_count || 72}
              </div>
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                Versets
              </div>
            </div>
            <div>
              <div className="font-display font-black text-lg sm:text-xl text-white">
                {khassida.duree_estimee || '20 min'}
              </div>
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                Récitation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Segmented Navigation Sub-Bar ── */}
      <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('texte')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'texte'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'texte' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span>Texte Intégral & Versets</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
            activeTab === 'texte' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
          }`}>
            {verses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audios')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-display text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'audios'
              ? 'bg-white text-emerald-950 shadow-sm border border-slate-200/80 font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Music className={`w-4 h-4 ${activeTab === 'audios' ? 'text-emerald-700' : 'text-slate-400'}`} />
          <span>Audios & Répétition</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
            activeTab === 'audios' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
          }`}>
            {associatedAudios.length}
          </span>
        </button>
      </div>

      {/* ── TAB 1: FULL TEXT & VERSES ── */}
      {activeTab === 'texte' && (
        <div className="space-y-4">
          
          {/* Controls toolbar: Search verses + Font Size zoom */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher dans les versets..."
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs font-bold text-slate-500">Taille Calligraphie :</span>
              <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                <button
                  onClick={() => setFontSizeLevel(Math.max(1, fontSizeLevel - 1))}
                  className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow-xs"
                  title="Diminuer la taille"
                >
                  A-
                </button>
                <span className="text-xs font-black text-slate-700 px-2">
                  {fontSizeLevel === 1 ? 'Petite' : fontSizeLevel === 2 ? 'Normale' : fontSizeLevel === 3 ? 'Grande' : 'Max'}
                </span>
                <button
                  onClick={() => setFontSizeLevel(Math.min(4, fontSizeLevel + 1))}
                  className="w-7 h-7 rounded-lg bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow-xs"
                  title="Augmenter la taille"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Verses Stack */}
          <div className="space-y-3.5">
            {filteredVerses.map((verse) => (
              <div
                key={verse.num}
                className={`bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all hover:border-emerald-200 ${
                  verse.isBasmalah ? 'text-center bg-gradient-to-b from-emerald-50/40 to-white' : ''
                }`}
              >
                {/* Verse Header Badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center justify-center">
                    {verse.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {verse.isBasmalah ? 'Basmalah d\'Ouverture' : `Bayt #${verse.num}`}
                  </span>
                </div>

                {/* Arabic Calligraphy */}
                <div className="py-4">
                  <p 
                    className={`font-serif text-emerald-950 font-bold font-['Amiri',serif] ${getFontSizeClass()} ${
                      verse.isBasmalah ? 'text-center' : 'text-right'
                    }`}
                    dir="rtl"
                  >
                    {verse.arabe}
                  </p>
                </div>

                {/* Transliteration and French translation */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <p className="text-xs sm:text-sm font-mono font-bold text-emerald-800">
                    {verse.phonetique}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    « {verse.traduction} »
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── TAB 2: AUDIOS & RECITATION TRACKS ── */}
      {activeTab === 'audios' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">
                Audios de Référence & Versions Chantées
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Écoutez les versions officielles enregistrées pour le travail de diction, de tempo et d'harmonisation.
              </p>
            </div>

            {associatedAudios.length > 0 ? (
              <div className="space-y-3">
                {associatedAudios.map((audio) => {
                  const isCurrent = playingSonId === audio.id;
                  const isCurrentlyPlaying = isCurrent && isPlaying;

                  return (
                    <div
                      key={audio.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCurrent 
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30' 
                          : 'border-slate-200 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <button
                            onClick={() => togglePlayAudio(audio.id)}
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 flex-shrink-0 cursor-pointer ${
                              isCurrentlyPlaying
                                ? 'bg-emerald-800 text-white animate-pulse'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {isCurrentlyPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                          </button>

                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className="font-display font-black text-sm text-slate-900 truncate">
                              {audio.titre}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium">
                              <span>Récitateur : <strong className="text-slate-800">{audio.recitateur}</strong></span>
                              <span>•</span>
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">{audio.taille || '2.1 Mo'}</span>
                              <span>•</span>
                              <span>{audio.duree || '14 min'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={audio.audio_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <DownloadCloud className="w-4 h-4 text-slate-500" />
                            <span className="hidden sm:inline">Télécharger</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs italic">
                Aucun enregistrement audio spécifique lié à cette Khassida pour le moment.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

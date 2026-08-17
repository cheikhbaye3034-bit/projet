import React, { useState } from 'react';
import { Play, Pause, Upload, Music, Volume2, CheckCircle2, FileAudio } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AudioPlayerCard = ({ seance, khassida }) => {
  const { showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecordingUploaded, setIsRecordingUploaded] = useState(!!seance.recording_url);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    setIsRecordingUploaded(true);
    showToast('Enregistrement de la séance déposé avec succès !');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-6">
      {/* Khassida Title Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold text-ht-emerald bg-ht-mist px-2.5 py-0.5 rounded-full border border-ht-mint">
            Khassida du Jour ({khassida?.niveau || 'Niveau Général'})
          </span>
          <h3 className="font-display font-bold text-xl text-ht-ink mt-2">
            {khassida ? khassida.titre : 'Titre non spécifié'}
          </h3>
          <p className="text-xs text-ht-inkSoft">Auteur : {khassida?.auteur || 'Cheikh Ahmadou Bamba'}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center">
          <Music className="w-5 h-5" />
        </div>
      </div>

      {/* Audio Reference Player Box */}
      <div className="bg-ht-page rounded-2xl p-4 border border-ht-line flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-xl gradient-emerald text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <div>
            <div className="font-semibold text-xs text-ht-ink">Audio de Référence</div>
            <div className="text-[11px] text-ht-sage">
              {isPlaying ? 'En cours de lecture...' : 'Cliquer pour écouter la version modèle'}
            </div>
          </div>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center gap-1">
          {[40, 75, 50, 90, 30, 80, 60, 45, 85, 30].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-ht-emerald animate-pulse' : 'bg-ht-mint'
              }`}
              style={{ height: isPlaying ? `${(h * 24) / 100}px` : '10px' }}
            ></span>
          ))}
        </div>
      </div>

      {/* Session Recording Upload Zone */}
      <div className="pt-2 border-t border-ht-line">
        <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-2">
          Enregistrement de la répétition
        </label>

        {isRecordingUploaded ? (
          <div className="p-3.5 bg-ht-mist rounded-xl border border-ht-mint flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-medium text-ht-emerald">
              <FileAudio className="w-4 h-4" />
              <span>Enregistrement déposé par le superviseur</span>
            </div>
            <button
              onClick={() => setIsRecordingUploaded(false)}
              className="text-[11px] text-ht-sage hover:underline"
            >
              Remplacer
            </button>
          </div>
        ) : (
          <div
            onClick={handleSimulatedUpload}
            className="border-2 border-dashed border-ht-mint hover:border-ht-emerald bg-ht-page/50 rounded-2xl p-4 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 text-ht-sage mx-auto mb-1" />
            <p className="text-xs font-medium text-ht-ink">
              Déposer l'enregistrement audio de la séance
            </p>
            <p className="text-[10px] text-ht-sage">Formats acceptés : MP3, WAV, M4A (max 50Mo)</p>
          </div>
        )}
      </div>
    </div>
  );
};

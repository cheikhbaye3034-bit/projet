import React, { useState, useRef } from 'react';
import { Mic, Play, Pause, Calendar, Users, CheckCircle2, Clock, FileText, AudioWaveform, Upload, FolderOpen } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const EnregistrementsSubView = () => {
  const { seances, khassidas, kourels, addSeance, showToast } = useApp();
  const [playingRecordingId, setPlayingRecordingId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioFileInputRef = useRef(null);

  // Filter seances that have been completed or have an audio recording
  const recordedSeances = seances.filter((s) => s.statut === 'Terminée' || s.recording_url);

  const togglePlayRecording = (seanceId) => {
    if (playingRecordingId === seanceId) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingRecordingId(seanceId);
      setIsPlaying(true);
    }
  };

  // Ouvrir directement le gestionnaire de fichiers
  const handleTriggerFileInput = () => {
    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = '';
      audioFileInputRef.current.click();
    }
  };

  // Traiter le fichier audio sélectionné
  const handleAudioFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de taille : 50 Mo
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast && showToast(`⚠️ Le fichier est trop lourd (maximum ${MAX_SIZE_MB} Mo).`, 'error');
      return;
    }

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newSeance = {
      date: formattedDate,
      heure_debut: currentTime,
      heure_fin: currentTime,
      kourel_id: kourels[0]?.id || 'k1',
      khassida_id: khassidas[0]?.id || 'kh1',
      superviseur: 'Enregistrement importé',
      statut: 'Terminée',
      notes: `📁 Fichier importé : ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} Mo)`,
      recording_url: URL.createObjectURL(file),
      presences: []
    };

    addSeance && addSeance(newSeance);
    showToast && showToast(`🎙️ Enregistrement "${cleanTitle}" importé avec succès depuis votre appareil !`);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Input fichier caché — ouvre le gestionnaire de fichiers au clic */}
      <input
        type="file"
        ref={audioFileInputRef}
        onChange={handleAudioFileSelected}
        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.flac,.wma"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-ht-sage uppercase tracking-wider">
            Archives & Audio Live
          </span>
          <h3 className="font-display font-bold text-xl text-ht-ink mt-0.5">
            Enregistrements des Séances de Répétition
          </h3>
          <p className="text-xs text-ht-inkSoft mt-1">
            Réécoute audio des séances enregistrées par Kourel avec le récapitulatif de présence et les notes des superviseurs.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center font-bold border border-ht-mint">
          <Mic className="w-6 h-6 text-ht-emerald" />
        </div>
      </div>

      {/* ── Bouton Ajouter un Enregistrement ── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleTriggerFileInput}
          className="group px-5 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg hover:shadow-xl flex items-center gap-2.5 cursor-pointer transition-all duration-200"
          title="Sélectionner un fichier audio depuis votre appareil"
        >
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="block">Ajouter un Enregistrement</span>
            <span className="block text-[10px] font-medium text-emerald-200 opacity-80">
              Importer depuis votre appareil
            </span>
          </div>
          <Upload className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Grid of Recorded Sessions */}
      <div className="space-y-4">
        {recordedSeances.length > 0 ? (
          recordedSeances.map((seance) => {
            const khassida = khassidas.find((kh) => kh.id === seance.khassida_id);
            const kourel = kourels.find((k) => k.id === seance.kourel_id);
            const isPlayingThis = playingRecordingId === seance.id && isPlaying;

            const totalPresents = seance.presences.filter((p) => p.statut === 'Présent').length;
            const totalRetards = seance.presences.filter((p) => p.statut === 'En retard').length;
            const totalAbsents = seance.presences.filter((p) => p.statut === 'Absent').length;

            return (
              <div
                key={seance.id}
                className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Play Recording Button */}
                    <button
                      onClick={() => togglePlayRecording(seance.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isPlayingThis
                          ? 'bg-ht-emerald text-white shadow-md'
                          : 'bg-ht-mist text-ht-emerald hover:bg-ht-emerald hover:text-white'
                      }`}
                    >
                      {isPlayingThis ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-base text-ht-ink">
                          {khassida ? khassida.titre : 'Khassida'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ht-mist text-ht-emerald border border-ht-mint">
                          {kourel ? kourel.nom.split('—')[1] || kourel.nom : 'Kourel'}
                        </span>
                      </div>
                      <div className="text-xs text-ht-sage mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{seance.date} ({seance.heure_debut} - {seance.heure_fin})</span>
                        </span>
                        <span>•</span>
                        <span>Superviseur : {seance.superviseur}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Stats Pills */}
                  <div className="flex items-center gap-2 text-center text-xs self-end sm:self-center">
                    <div className="px-3 py-1.5 bg-ht-mist rounded-xl border border-ht-mint font-semibold text-ht-emerald">
                      {totalPresents} Présents
                    </div>
                    {totalRetards > 0 && (
                      <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 font-semibold text-ht-amber">
                        {totalRetards} Retards
                      </div>
                    )}
                    {totalAbsents > 0 && (
                      <div className="px-3 py-1.5 bg-red-50 rounded-xl border border-red-200 font-semibold text-ht-clay">
                        {totalAbsents} Absents
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes & Audio Player Progress Bar */}
                {isPlayingThis && (
                  <div className="p-4 bg-ht-mist/70 rounded-2xl border border-ht-mint space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-semibold text-ht-emerald">
                      <span>Lecture de l'enregistrement de séance en cours...</span>
                      <span>12:45 / 45:00</span>
                    </div>
                    <div className="w-full h-2 bg-ht-line rounded-full overflow-hidden">
                      <div className="h-full bg-ht-emerald rounded-full w-1/4" />
                    </div>
                  </div>
                )}

                {seance.notes && (
                  <div className="p-3.5 bg-ht-page rounded-2xl border border-ht-line text-xs text-ht-inkSoft flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-ht-sage flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-ht-ink">Remarques du Superviseur : </span>
                      <span>{seance.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-ht-sage text-sm italic">
            Aucun enregistrement de séance disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

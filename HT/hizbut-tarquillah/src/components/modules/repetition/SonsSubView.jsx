import React, { useState } from 'react';
import { Music, Play, Pause, Volume2, Download, Radio, Clock, Disc, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { AudioModal } from './AudioModal';

export const SonsSubView = () => {
  const { sonsAudio, deleteSonAudio, khassidas } = useApp();
  const [playingSonId, setPlayingSonId] = useState(sonsAudio[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeSon = sonsAudio.find((s) => s.id === playingSonId) || sonsAudio[0];

  const togglePlay = (id) => {
    if (playingSonId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingSonId(id);
      setIsPlaying(true);
    }
  };

  const handleDelete = (id, titre) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'audio de référence "${titre}" ?`)) {
      deleteSonAudio(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Featured Main Audio Player Header Card */}
      {activeSon && (
        <div className="bg-gradient-to-r from-ht-ink via-slate-900 to-ht-emerald text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-ht-line space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-ht-mint shadow-inner">
                <Disc className={`w-8 h-8 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-semibold text-ht-mint uppercase tracking-wider">
                  Son Audio de Référence en Lecture
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-0.5">
                  {activeSon.titre}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Récitateur : <span className="text-ht-amber font-semibold">{activeSon.recitateur}</span> • Qualité : {activeSon.qualite}
                </p>
              </div>
            </div>

            {/* Main Play/Pause Button */}
            <button
              onClick={() => togglePlay(activeSon.id)}
              className="w-14 h-14 rounded-2xl gradient-emerald text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all self-end sm:self-center cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>

          {/* Progress Bar & Audio Player Controls */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-300 font-mono">
              <span>04:12</span>
              <span>{activeSon.duree}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-ht-mint rounded-full w-1/3 transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* List of Audio Reference Tracks Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-ht-mist text-ht-emerald flex items-center justify-center border border-ht-mint font-bold shadow-xs">
              <Music className="w-5 h-5 text-ht-emerald" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-ht-ink">
                Sous-Section : Audios de Référence ({sonsAudio.length})
              </h3>
              <p className="text-xs text-ht-emerald font-semibold">
                Gestion et écoute des enregistrements officiels de répétition
              </p>
            </div>
          </div>

          {/* CTA Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-anim px-5 py-2.5 gradient-emerald text-white text-xs font-bold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Audio de référence</span>
          </button>
        </div>

        {/* Audio Track List */}
        <div className="divide-y divide-ht-line pt-2">
          {sonsAudio.length > 0 ? (
            sonsAudio.map((son) => {
              const isCurrent = playingSonId === son.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;

              return (
                <div
                  key={son.id}
                  className={`py-4 px-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    isCurrent ? 'bg-ht-mist/80 border border-ht-mint' : 'hover:bg-ht-page'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => togglePlay(son.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        isCurrentlyPlaying
                          ? 'bg-ht-emerald text-white shadow-md'
                          : 'bg-ht-mist text-ht-emerald hover:bg-ht-emerald hover:text-white'
                      }`}
                    >
                      {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div>
                      <h4 className="font-display font-bold text-sm text-ht-ink">
                        {son.titre}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-ht-sage mt-0.5">
                        <span>Récitateur : <strong>{son.recitateur}</strong></span>
                        <span>•</span>
                        <span>Durée : {son.duree}</span>
                        <span>•</span>
                        <span>Taille : {son.taille}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <span className="px-2.5 py-1 bg-ht-page rounded-lg border border-ht-line text-[11px] font-semibold text-ht-inkSoft">
                      {son.qualite}
                    </span>
                    <a
                      href={son.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-ht-sage hover:text-ht-emerald hover:bg-ht-mist rounded-xl transition-colors"
                      title="Télécharger l'audio"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDelete(son.id, son.titre)}
                      className="p-2 text-ht-clay hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                      title="Supprimer l'audio de référence"
                    >
                      <Trash2 className="w-4 h-4 text-ht-clay" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-ht-sage text-sm italic">
              Aucun audio de référence disponible. Cliquez sur "Ajouter un Audio de référence" ci-dessus.
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

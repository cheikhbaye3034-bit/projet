import React, { useState } from 'react';
import { X, Music, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AudioModal = ({ isOpen, onClose }) => {
  const { khassidas, addSonAudio } = useApp();

  const [formData, setFormData] = useState({
    titre: '',
    khassida_id: khassidas[0]?.id || 'kh1',
    recitateur: 'Kourel Miftahoul Mouna',
    duree: '20:00',
    qualite: 'HQ 320 kbps',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    taille: '15.0 Mo'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    addSonAudio(formData);
    setFormData({
      titre: '',
      khassida_id: khassidas[0]?.id || 'kh1',
      recitateur: 'Kourel Miftahoul Mouna',
      duree: '20:00',
      qualite: 'HQ 320 kbps',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      taille: '15.0 Mo'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-ht-ink/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-6 border border-ht-line shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ht-line pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-emerald text-white flex items-center justify-center font-bold shadow-md">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-ht-ink">
                Ajouter un Audio de Référence
              </h3>
              <p className="text-xs text-ht-emerald font-semibold">
                Répertoriez un nouvel enregistrement audio pour l'apprentissage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-ht-page hover:bg-ht-mist text-gray-400 font-bold flex items-center justify-center border border-ht-line transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
              Titre de l'Enregistrement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Mawahibou Nafi — Version Officielle Kourel 1"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Récitateur / Kourel
              </label>
              <input
                type="text"
                value={formData.recitateur}
                onChange={(e) => setFormData({ ...formData, recitateur: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Khassida Associée
              </label>
              <select
                value={formData.khassida_id}
                onChange={(e) => setFormData({ ...formData, khassida_id: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald"
              >
                {khassidas.map((kh) => (
                  <option key={kh.id} value={kh.id}>
                    {kh.titre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Durée (mm:ss)
              </label>
              <input
                type="text"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Qualité Audio
              </label>
              <select
                value={formData.qualite}
                onChange={(e) => setFormData({ ...formData, qualite: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald"
              >
                <option value="HQ 320 kbps">HQ 320 kbps</option>
                <option value="HQ 256 kbps">HQ 256 kbps</option>
                <option value="HQ 192 kbps">HQ 192 kbps</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
              Lien Audio URL (MP3)
            </label>
            <input
              type="text"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-mono font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-ht-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-ht-line rounded-xl text-xs font-bold text-ht-inkSoft hover:bg-ht-page"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-anim px-6 py-2.5 gradient-emerald text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter l'Audio</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

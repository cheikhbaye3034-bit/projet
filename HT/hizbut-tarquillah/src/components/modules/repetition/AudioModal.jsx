import React, { useState } from 'react';
import { X, Music, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const AudioModal = ({ isOpen, onClose }) => {
  const { khassidas, addSonAudio, showToast } = useApp();

  const [formData, setFormData] = useState({
    titre: '',
    titre_arabe: '',
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

    addSonAudio({
      ...formData,
      id: `son_${Date.now()}`
    });

    showToast && showToast(`Audio "${formData.titre}" ajouté avec succès !`);

    setFormData({
      titre: '',
      titre_arabe: '',
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
    <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[500] animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header with Background Image */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md border border-emerald-600/40">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Ajouter un Audio de Référence
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Enregistrement officiel de répétition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Titre de l'Enregistrement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Mawahibou Nafi — Version Officielle Kourel 1"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-800 block">
              Titre en arabe (optionnel)
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="ex: مواهب النافع..."
              value={formData.titre_arabe}
              onChange={(e) => setFormData({ ...formData, titre_arabe: e.target.value })}
              className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-base font-serif font-bold text-emerald-900 focus:outline-none focus:border-emerald-600 font-['Amiri',serif]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Récitateur / Kourel
              </label>
              <input
                type="text"
                value={formData.recitateur}
                onChange={(e) => setFormData({ ...formData, recitateur: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Khassida Associée
              </label>
              <select
                value={formData.khassida_id}
                onChange={(e) => setFormData({ ...formData, khassida_id: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
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
              <label className="text-xs font-bold text-slate-700 block">
                Durée (mm:ss)
              </label>
              <input
                type="text"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Qualité Audio
              </label>
              <select
                value={formData.qualite}
                onChange={(e) => setFormData({ ...formData, qualite: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="HQ 320 kbps">HQ 320 kbps</option>
                <option value="HQ 256 kbps">HQ 256 kbps</option>
                <option value="HQ 192 kbps">HQ 192 kbps</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Lien Audio URL (MP3)
            </label>
            <input
              type="text"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 cursor-pointer"
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

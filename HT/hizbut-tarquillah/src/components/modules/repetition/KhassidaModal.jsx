import React, { useState } from 'react';
import { X, BookOpen, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const KhassidaModal = ({ isOpen, onClose }) => {
  const { addKhassida, showToast } = useApp();

  const [formData, setFormData] = useState({
    titre: '',
    titre_arabe: '',
    auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul',
    duree_estimee: '20 min',
    versets_count: 72,
    pages_count: 3,
    audios_count: 0,
    vues_count: 0,
    date_ajout: new Date().toLocaleDateString('fr-FR'),
    niveau: 'Intermédiaire',
    is_bess_bi: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    addKhassida({
      ...formData,
      id: `kh_${Date.now()}`
    });

    showToast && showToast(`Khassida "${formData.titre}" ajoutée au répertoire avec succès !`);

    setFormData({
      titre: '',
      titre_arabe: '',
      auteur: 'Cheikh Ahmadou Bamba Khadimou Rassoul',
      duree_estimee: '20 min',
      versets_count: 72,
      pages_count: 3,
      audios_count: 0,
      vues_count: 0,
      date_ajout: new Date().toLocaleDateString('fr-FR'),
      niveau: 'Intermédiaire',
      is_bess_bi: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/15 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[500] animate-fade-in select-none">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header with background image */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Ajouter une Khassida (Kaggu)
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Répertoire officiel des poèmes sacrés
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
              Titre en alphabet latin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Fa-sayakfîkahumul Lâha, Achkurul lâha..."
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-800 block">
              Titre en arabe (Calligraphie)
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="ex: فسيكفيهم الله ، أشكر الله..."
              value={formData.titre_arabe}
              onChange={(e) => setFormData({ ...formData, titre_arabe: e.target.value })}
              className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-base font-serif font-bold text-emerald-900 focus:outline-none focus:border-emerald-600 font-['Amiri',serif]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Nombre de Pages
              </label>
              <input
                type="number"
                value={formData.pages_count}
                onChange={(e) => setFormData({ ...formData, pages_count: parseInt(e.target.value) || 1 })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Niveau de maîtrise
              </label>
              <select
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Nombre de Versets
              </label>
              <input
                type="number"
                value={formData.versets_count}
                onChange={(e) => setFormData({ ...formData, versets_count: parseInt(e.target.value) || 50 })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Durée Estimée
              </label>
              <input
                type="text"
                value={formData.duree_estimee}
                onChange={(e) => setFormData({ ...formData, duree_estimee: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_bess_bi"
              checked={formData.is_bess_bi}
              onChange={(e) => setFormData({ ...formData, is_bess_bi: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
            <label htmlFor="is_bess_bi" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
              <span>Mettre en avant comme</span>
              <span className="text-emerald-700 font-extrabold">✨ Khassida Bess Bi</span>
            </label>
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
              <span>Enregistrer la Khassida</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

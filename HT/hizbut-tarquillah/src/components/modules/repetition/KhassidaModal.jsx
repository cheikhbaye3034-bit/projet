import React, { useState } from 'react';
import { X, BookOpen, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const KhassidaModal = ({ isOpen, onClose }) => {
  const { addKhassida } = useApp();

  const [formData, setFormData] = useState({
    titre: '',
    auteur: 'Cheikh Ahmadou Bamba',
    duree_estimee: '20 min',
    versets_count: 100,
    niveau: 'Intermédiaire'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    addKhassida(formData);
    setFormData({
      titre: '',
      auteur: 'Cheikh Ahmadou Bamba',
      duree_estimee: '20 min',
      versets_count: 100,
      niveau: 'Intermédiaire'
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
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-ht-ink">
                Ajouter une Khassida au Programme
              </h3>
              <p className="text-xs text-ht-emerald font-semibold">
                Saisissez les détails de l'œuvre spirituelle à répéter
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
              Titre de la Khassida <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="ex: Mawahibou Nafi, Jalibatul Maratib..."
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Auteur
              </label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Niveau de maîtrise
              </label>
              <select
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-bold text-ht-ink focus:outline-none focus:border-ht-emerald"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Nombre de Versets
              </label>
              <input
                type="number"
                value={formData.versets_count}
                onChange={(e) => setFormData({ ...formData, versets_count: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ht-sage uppercase tracking-wider block">
                Durée Estimée
              </label>
              <input
                type="text"
                value={formData.duree_estimee}
                onChange={(e) => setFormData({ ...formData, duree_estimee: e.target.value })}
                className="w-full p-3 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>
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
              <span>Ajouter la Khassida</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

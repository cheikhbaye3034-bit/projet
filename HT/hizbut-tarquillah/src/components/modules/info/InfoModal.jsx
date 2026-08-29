import React, { useState } from 'react';
import { X, Newspaper, Pin, Image, FileText } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const InfoModal = ({ isOpen, onClose }) => {
  const { addInformation } = useApp();

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    categorie: 'Annonce',
    image: '',
    epingle: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titre || !formData.contenu) {
      alert('Veuillez saisir un titre et un contenu.');
      return;
    }
    addInformation(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-none">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-ht-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-emerald text-white flex items-center justify-center font-bold">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-ht-ink">Publier une information</h3>
              <p className="text-xs text-ht-inkSoft">Nouvelle annonce ou communiqué officiel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ht-sage hover:bg-ht-mist transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
              Titre de l'information *
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              placeholder="ex: Réunion de préparation du Magal 2026"
              className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Catégorie
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              >
                <option value="Annonce">Annonce</option>
                <option value="Événement">Événement</option>
                <option value="Communiqué">Communiqué</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                URL Image (optionnelle)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
              Contenu de l'annonce *
            </label>
            <textarea
              required
              rows={4}
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              placeholder="Rédigez le corps du message..."
              className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
            ></textarea>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="epingleCheck"
              checked={formData.epingle}
              onChange={(e) => setFormData({ ...formData, epingle: e.target.checked })}
              className="w-4 h-4 text-ht-emerald rounded border-ht-line focus:ring-ht-emerald"
            />
            <label htmlFor="epingleCheck" className="text-xs font-semibold text-ht-ink flex items-center gap-1.5 cursor-pointer">
              <Pin className="w-3.5 h-3.5 text-ht-amber fill-ht-amber" />
              <span>Épingler cette annonce en haut du tableau de bord</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-ht-line">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-ht-line rounded-xl text-xs font-semibold text-ht-inkSoft hover:bg-ht-page"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 gradient-emerald text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Publier l'information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, User, Phone, MapPin, Briefcase, Calendar, Users } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const MembreModal = ({ isOpen, onClose }) => {
  const { kourels, addMembre } = useApp();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    profession: 'Salarié',
    date_adhesion: new Date().toISOString().split('T')[0],
    kourel_id: kourels[0]?.id || 'k1',
    statut: 'Actif'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.telephone) {
      alert('Veuillez remplir le nom, prénom et téléphone.');
      return;
    }
    addMembre(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ht-ink/40 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-ht-line shadow-2xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-ht-line">
          <div>
            <h3 className="font-display font-bold text-xl text-ht-ink">Ajouter un nouveau membre</h3>
            <p className="text-xs text-ht-inkSoft">Création de la fiche membre de l'association</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ht-sage hover:bg-ht-mist transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="ex: MBACKE"
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                placeholder="ex: Serigne Cheikh"
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
              Téléphone *
            </label>
            <input
              type="text"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="ex: +221 77 123 45 67"
              className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
              Adresse
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              placeholder="ex: Touba Mosquée, Quartier Darou Minam"
              className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Profession
              </label>
              <select
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              >
                <option value="Élève">Élève</option>
                <option value="Étudiant">Étudiant</option>
                <option value="Salarié">Salarié</option>
                <option value="Sans emploi">Sans emploi</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Kourel de rattachement
              </label>
              <select
                value={formData.kourel_id}
                onChange={(e) => setFormData({ ...formData, kourel_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              >
                {kourels.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Date d'adhésion
              </label>
              <input
                type="date"
                value={formData.date_adhesion}
                onChange={(e) => setFormData({ ...formData, date_adhesion: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1.5">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="Suspendu">Suspendu</option>
              </select>
            </div>
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
              Enregistrer le membre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

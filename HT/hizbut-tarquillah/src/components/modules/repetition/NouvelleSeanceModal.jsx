import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, User, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const NouvelleSeanceModal = ({ isOpen, onClose, defaultKourelId, onSeanceCreated }) => {
  const { kourels, khassidas, membres, currentUser, addSeance } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [kourelId, setKourelId] = useState(defaultKourelId || kourels[0]?.id || 'k1');
  const [date, setDate] = useState(todayStr);
  const [heureDebut, setHeureDebut] = useState('20:00');
  const [heureFin, setHeureFin] = useState('22:00');
  const [khassidaId, setKhassidaId] = useState(khassidas[0]?.id || 'kh1');
  const [superviseur, setSuperviseur] = useState(currentUser ? `${currentUser.prenom} ${currentUser.nom}` : '');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Find members of selected kourel to initialize presences
    const membersOfKourel = membres.filter((m) => m.kourel_id === kourelId);
    const initialPresences = membersOfKourel.map((m) => ({
      membre_id: m.id,
      statut: 'Non pointé',
      heure_arrivee: '',
      justifie: false
    }));

    const newSeance = addSeance({
      kourel_id: kourelId,
      date,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      khassida_id: khassidaId,
      superviseur: superviseur || 'Superviseur Kourel',
      statut: 'En cours',
      notes,
      presences: initialPresences
    });

    if (onSeanceCreated && newSeance) {
      onSeanceCreated(newSeance.id);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-ht-line shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-ht-line flex items-center justify-between gradient-emerald text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Nouvelle Feuille de Pointage
              </h3>
              <p className="text-xs text-white/80">Créer une séance de répétition & ouvrir le pointage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Kourel Selector */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
              Kourel rattaché *
            </label>
            <select
              value={kourelId}
              onChange={(e) => setKourelId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-ht-page border border-ht-line rounded-2xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
            >
              {kourels.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Horaires */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
                Date séance *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
                Heure début *
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                required
                className="w-full px-3 py-2 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
                Heure fin *
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-ht-page border border-ht-line rounded-xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
              />
            </div>
          </div>

          {/* Khassida au programme */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
              Khassida à répéter *
            </label>
            <select
              value={khassidaId}
              onChange={(e) => setKhassidaId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-ht-page border border-ht-line rounded-2xl text-xs font-semibold text-ht-ink focus:outline-none focus:border-ht-emerald"
            >
              {khassidas.map((kh) => (
                <option key={kh.id} value={kh.id}>
                  {kh.titre} ({kh.auteur})
                </option>
              ))}
            </select>
          </div>

          {/* Superviseur */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
              Superviseur du pointage
            </label>
            <input
              type="text"
              value={superviseur}
              onChange={(e) => setSuperviseur(e.target.value)}
              placeholder="Nom du superviseur responsable..."
              className="w-full px-4 py-2.5 bg-ht-page border border-ht-line rounded-2xl text-xs font-medium text-ht-ink focus:outline-none focus:border-ht-emerald"
            />
          </div>

          {/* Notes / Remarques */}
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-1">
              Notes ou objectifs de la séance
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Objectifs de révision, consignes particulières..."
              className="w-full px-4 py-2 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink focus:outline-none focus:border-ht-emerald resize-none"
            ></textarea>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="pt-3 border-t border-ht-line flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-ht-page text-ht-inkSoft hover:bg-ht-mist rounded-xl text-xs font-semibold border border-ht-line transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-anim px-5 py-2.5 gradient-emerald text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Créer la feuille & pointer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

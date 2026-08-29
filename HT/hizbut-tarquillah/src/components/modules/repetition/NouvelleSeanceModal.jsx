import React, { useState } from 'react';
import { X, Calendar, Clock, BookOpen, User, FileText, CheckCircle2, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import heroMicBg from '../../../assets/images/repetition_hero_mic.jpg';

export const NouvelleSeanceModal = ({ isOpen, onClose, defaultKourelId, onSeanceCreated }) => {
  const { kourels, khassidas, membres, currentUser, addSeance, showToast } = useApp();

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

    showToast && showToast(`Nouvelle séance planifiée pour le ${date} !`);

    if (onSeanceCreated && newSeance) {
      onSeanceCreated(newSeance.id);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header with Background Image */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-950 via-[#144631] to-[#0A261A] text-white flex items-center justify-between overflow-hidden">
          <div 
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroMicBg})` }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md border border-emerald-600/40">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                Planifier une Nouvelle Séance
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                Feuille d'émargement et vocalisation de répétition
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Section Kourel <span className="text-red-500">*</span>
            </label>
            <select
              value={kourelId}
              onChange={(e) => setKourelId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              {kourels.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nom} ({k.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Date de la Séance <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Superviseur Référent
              </label>
              <input
                type="text"
                value={superviseur}
                onChange={(e) => setSuperviseur(e.target.value)}
                placeholder="Nom du responsable..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Heure Début
              </label>
              <input
                type="time"
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Heure Fin
              </label>
              <input
                type="time"
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Khassida au Programme
            </label>
            <select
              value={khassidaId}
              onChange={(e) => setKhassidaId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
            >
              {khassidas.map((kh) => (
                <option key={kh.id} value={kh.id}>
                  {kh.titre} {kh.titre_arabe ? `(${kh.titre_arabe})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Consignes & Notes de Répétition
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Répétition générale sur le ton 'Kourel 1', apprentissage des couplets 5 à 12..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Footer Actions */}
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
              <span>Créer la Séance</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

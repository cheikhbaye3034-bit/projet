import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  Hourglass,
  FileText,
  ChevronDown,
  Plus,
  X,
  Info
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const MOTIFS = [
  { value: 'maladie', label: 'Maladie / Problème de santé', icon: '🏥' },
  { value: 'voyage', label: 'Voyage / Déplacement', icon: '✈️' },
  { value: 'travail', label: 'Obligation professionnelle', icon: '💼' },
  { value: 'etudes', label: 'Études / Examen', icon: '📚' },
  { value: 'famille', label: 'Événement familial', icon: '👨‍👩‍👧‍👦' },
  { value: 'autre', label: 'Autre motif', icon: '📝' }
];

const STATUT_CONFIG = {
  'En attente': { color: 'amber', icon: Hourglass, label: 'En attente' },
  'Acceptée': { color: 'emerald', icon: CheckCircle2, label: 'Acceptée' },
  'Refusée': { color: 'rose', icon: XCircle, label: 'Refusée' }
};

export const MembreAbsenceSection = () => {
  const { currentUser, seances, absenceRequests, addAbsenceRequest, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    seance_date: '',
    motif: '',
    justification: '',
    duree: 'seance', // 'seance' | 'semaine' | 'personnalise'
    date_debut: '',
    date_fin: ''
  });

  // Get upcoming seances for member's kourel
  const upcomingSeances = (seances || []).filter(
    s => s.kourel_id === (currentUser?.kourel_id || 'k1') &&
    (s.statut === 'Planifiée' || s.statut === 'En cours')
  );

  // Filter member's own absence requests
  const myAbsences = (absenceRequests || []).filter(
    r => r.membre_id === currentUser?.id
  );

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.motif) {
      showToast && showToast('⚠️ Veuillez sélectionner un motif d\'absence.', 'error');
      return;
    }
    if (!formData.justification.trim()) {
      showToast && showToast('⚠️ Veuillez fournir une justification.', 'error');
      return;
    }

    const motifLabel = MOTIFS.find(m => m.value === formData.motif)?.label || formData.motif;

    addAbsenceRequest({
      seance_date: formData.seance_date || 'Non spécifiée',
      motif: formData.motif,
      motif_label: motifLabel,
      justification: formData.justification.trim(),
      duree: formData.duree,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin
    });

    // Reset form
    setFormData({
      seance_date: '',
      motif: '',
      justification: '',
      duree: 'seance',
      date_debut: '',
      date_fin: ''
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Header & CTA Button ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-black text-lg text-slate-900">Signalement d'Absence</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Informez votre responsable en cas d'absence prévue à une séance de répétition.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm ${
            showForm
              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              : 'bg-emerald-800 hover:bg-emerald-700 text-white'
          }`}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Annuler' : 'Signaler une absence'}</span>
        </button>
      </div>

      {/* ── Formulaire de Signalement ── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden animate-fade-in">

          {/* Form Header Banner */}
          <div className="relative p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-black text-base">Nouvelle Demande d'Absence</h3>
                <p className="text-xs text-amber-100 font-medium mt-0.5">
                  Remplissez ce formulaire pour informer votre superviseur.
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-4">

            {/* Séance concernée */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                Séance concernée
              </label>
              {upcomingSeances.length > 0 ? (
                <select
                  value={formData.seance_date}
                  onChange={(e) => handleChange('seance_date', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">— Sélectionner la séance —</option>
                  {upcomingSeances.map(s => (
                    <option key={s.id} value={s.date}>
                      {s.date} • {s.heure_debut} - {s.heure_fin}
                    </option>
                  ))}
                  <option value="multiple">Plusieurs séances à venir</option>
                </select>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                  Aucune séance planifiée pour votre Kourel.
                  <input
                    type="date"
                    value={formData.seance_date}
                    onChange={(e) => handleChange('seance_date', e.target.value)}
                    className="w-full mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            {/* Motif de l'absence */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Motif de l'absence <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOTIFS.map(motif => (
                  <button
                    key={motif.value}
                    type="button"
                    onClick={() => handleChange('motif', motif.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      formData.motif === motif.value
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{motif.icon}</span>
                    <p className={`text-[11px] font-bold mt-1 leading-tight ${
                      formData.motif === motif.value ? 'text-emerald-900' : 'text-slate-700'
                    }`}>
                      {motif.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Justification détaillée */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                Justification détaillée <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.justification}
                onChange={(e) => handleChange('justification', e.target.value)}
                placeholder="Décrivez brièvement la raison de votre absence (ex: Je serai en déplacement à Touba pour un événement familial du 15 au 18 août)..."
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 resize-none"
              />
              <p className="text-[10px] text-slate-400">
                Soyez précis pour faciliter le traitement de votre demande.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-200" />
                <span>Soumettre la demande</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Historique des Demandes ── */}
      {myAbsences.length > 0 ? (
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
            Historique de vos demandes ({myAbsences.length})
          </h3>
          {myAbsences.map((absence) => {
            const config = STATUT_CONFIG[absence.statut] || STATUT_CONFIG['En attente'];
            const StatusIcon = config.icon;

            return (
              <div
                key={absence.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      config.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      config.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                          config.color === 'amber' ? 'text-amber-800 bg-amber-50 border-amber-200' :
                          config.color === 'emerald' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' :
                          'text-rose-800 bg-rose-50 border-rose-200'
                        }`}>
                          {config.label}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Soumis le {absence.date_soumission}
                        </span>
                      </div>
                      <p className="font-display font-black text-sm text-slate-900">
                        {absence.motif_label || absence.motif}
                      </p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Séance du {absence.seance_date} — « {absence.justification} »
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !showForm && (
        <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="font-display font-black text-sm text-slate-800 mb-1">Aucune absence signalée</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Vous n'avez aucune demande d'absence en cours. Utilisez le bouton ci-dessus pour signaler une absence prévue.
          </p>
        </div>
      )}
    </div>
  );
};

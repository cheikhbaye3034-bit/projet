import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2,
  Award,
  Layers,
  Sparkles,
  Hash
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const MembreDetailDrawer = ({ membreId, onClose }) => {
  const { membres, kourels, kamilCycle, seances, deleteMembre } = useApp();

  if (!membreId) return null;

  const membre = membres.find((m) => m.id === membreId);
  if (!membre) return null;

  const kourel = kourels.find((k) => k.id === membre.kourel_id);

  // Kamil Juki assignment for this member
  const juzAssigned = kamilCycle?.assignations?.find((a) => a.membre_id === membreId);

  // History of recorded presences for this member across all seances
  const memberPresences = [];
  (seances || []).forEach((s) => {
    const p = s.presences?.find((item) => item.membre_id === membreId);
    if (p) {
      memberPresences.push({
        seanceId: s.id,
        date: s.date,
        statut: p.statut,
        heure_arrivee: p.heure_arrivee,
        khassidaId: s.khassida_id
      });
    }
  });

  const totalRecorded = memberPresences.length;
  const totalPresents = memberPresences.filter(p => p.statut === 'Présent').length;
  const totalRetards = memberPresences.filter(p => p.statut === 'En retard').length;
  const totalAbsents = memberPresences.filter(p => p.statut === 'Absent').length;

  const presenceRate = totalRecorded > 0 ? Math.round(((totalPresents + totalRetards * 0.5) / totalRecorded) * 100) : 100;

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le membre ${membre.prenom} ${membre.nom} ?`)) {
      deleteMembre(membre.id);
      onClose();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Top Action Bar: Back button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-soft-xs transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800" />
          <span>Retour au Répertoire des Membres</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
          Fiche Membre Individuelle
        </span>
      </div>

      {/* Main Header Profile Card (100% Direct on Page, No Modal, No Dark Stain) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar Initials */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-emerald-800 text-white font-display font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md flex-shrink-0">
            {membre.prenom?.[0] || 'M'}{membre.nom?.[0] || 'D'}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 leading-tight">
                {membre.prenom} {membre.nom}
              </h1>
              
              <span
                className={`px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase rounded-md flex items-center gap-1 ${
                  membre.statut === 'Actif'
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${membre.statut === 'Actif' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                <span>{membre.statut || 'Actif'}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>{kourel ? kourel.nom : 'Kourel non spécifié'}</span>
              </span>

              <span className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Inscrit le {membre.date_adhesion || '10 Février 2021'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Supprimer */}
        <button
          onClick={handleDelete}
          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-end md:self-center shadow-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span>Supprimer ce membre</span>
        </button>
      </div>

      {/* Grid of Clean Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1 : INFORMATIONS PERSONNELLES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-800" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Identité & Coordonnées
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Prénom</span>
              <span className="font-bold text-slate-900">{membre.prenom}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Nom de famille</span>
              <span className="font-bold text-slate-900 uppercase">{membre.nom}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Téléphone</span>
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{membre.telephone}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Profession</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{membre.profession || 'Salarié'}</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium block">Adresse de résidence</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{membre.adresse || 'Touba Mosquée, Quartier Darou Minam'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2 : ASSIDUITÉ & PRÉSENCES */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-800" />
              <h2 className="font-display font-bold text-sm text-slate-900">
                Assiduité & Séances
              </h2>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              {presenceRate}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="font-display font-black text-xl text-emerald-900 block">{totalPresents}</span>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block mt-1">Présences</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="font-display font-black text-xl text-amber-900 block">{totalRetards}</span>
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block mt-1">Retards</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="font-display font-black text-xl text-rose-900 block">{totalAbsents}</span>
              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block mt-1">Absences</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Total séances enregistrées</span>
              <span className="font-bold text-slate-900">{totalRecorded} séances</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Régularité globale</span>
              <span className="font-bold text-emerald-800">{presenceRate >= 80 ? 'Excellente' : 'Moyenne'}</span>
            </div>
          </div>
        </div>

        {/* CARD 3 : LECTURE DU SAINT CORAN (KAMIL) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-emerald-800" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Récitation du Coran (Kamil)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {juzAssigned ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-xs font-black">
                    Juki N° {juzAssigned.juz}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${
                    juzAssigned.statut === 'Terminé' 
                      ? 'bg-emerald-200 text-emerald-950' 
                      : 'bg-amber-200 text-amber-950'
                  }`}>
                    {juzAssigned.statut}
                  </span>
                </div>

                <div>
                  <p className="font-display font-bold text-sm text-emerald-950">
                    {juzAssigned.nom_juz}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Cycle en cours #{kamilCycle?.numero_cycle || 42}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                <BookOpen className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-semibold">Aucun Juki attribué</p>
                <p className="text-[11px] text-slate-400">Ce membre n'a pas encore de portion assignée sur ce cycle.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

import React from 'react';
import { X, User, Phone, MapPin, Briefcase, Calendar, BookOpen, CheckCircle2, Clock, XCircle, ShieldCheck, Wallet, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import bgMembre from '../../../assets/images/bg_membre.jpg';

export const MembreDetailDrawer = ({ membreId, onClose }) => {
  const { membres, kourels, kamilCycle, seances, deleteMembre } = useApp();

  if (!membreId) return null;

  const membre = membres.find((m) => m.id === membreId);
  if (!membre) return null;

  const kourel = kourels.find((k) => k.id === membre.kourel_id);

  // Kamil Juki assignment for this member
  const juzAssigned = kamilCycle.assignations.find((a) => a.membre_id === membreId);

  // History of recorded presences for this member across all seances
  const memberPresences = [];
  seances.forEach((s) => {
    const p = s.presences.find((item) => item.membre_id === membreId);
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

  const presenceRate = totalRecorded > 0 ? Math.round(((totalPresents + totalRetards) / totalRecorded) * 100) : 100;
  const isEnRegle = membre.cotisation_statut === 'À jour';

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le membre ${membre.prenom} ${membre.nom} ?`)) {
      deleteMembre(membre.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in">
      {/* Backdrop with dark blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ht-ink/75 backdrop-blur-md transition-opacity"
      ></div>

      {/* Centered Modal Card with Background Image 1779138262345.jpg */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-ht-line animate-scale-up">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20"
          style={{ backgroundImage: `url(${bgMembre})` }}
        />

        {/* Top Header */}
        <div className="p-6 border-b border-ht-line flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-emerald text-white flex items-center justify-center font-display font-extrabold text-xl shadow-md border border-ht-mint">
              {membre.prenom[0]}{membre.nom[0]}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-ht-ink leading-snug">
                {membre.prenom} {membre.nom}
              </h3>
              <p className="text-xs text-ht-emerald font-bold mt-0.5">
                {kourel ? kourel.nom : 'Non rattaché'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-ht-sage hover:text-ht-ink hover:bg-ht-mist transition-all"
            title="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 relative z-10">
          {/* Status & Contact details */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-ht-line space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ht-sage uppercase tracking-wider">Statut Membre</span>
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                  membre.statut === 'Actif'
                    ? 'bg-ht-mist text-ht-emerald border border-ht-mint'
                    : membre.statut === 'Suspendu'
                    ? 'bg-red-50 text-ht-clay border border-red-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {membre.statut}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 text-ht-ink font-medium">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ht-sage flex-shrink-0" />
                <span>{membre.telephone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-ht-sage flex-shrink-0" />
                <span>Profession : {membre.profession}</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-1 sm:col-span-2">
                <MapPin className="w-4 h-4 text-ht-sage flex-shrink-0" />
                <span>{membre.adresse || 'Adresse non renseignée'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-ht-sage flex-shrink-0" />
                <span>Inscrit le : {membre.date_adhesion}</span>
              </div>
            </div>
          </div>

          {/* SECTION COTISATIONS (En règle ou pas) */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-ht-line shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-ht-ink">
                <Wallet className="w-4 h-4 text-ht-emerald" />
                <span>Statut des Cotisations</span>
              </div>
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 ${
                  isEnRegle
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {isEnRegle ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>EN RÈGLE</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>NON EN RÈGLE</span>
                  </>
                )}
              </span>
            </div>

            <div className="p-3.5 bg-ht-page/80 rounded-xl border border-ht-line space-y-2 text-xs">
              <div className="flex justify-between text-ht-ink font-medium">
                <span className="text-ht-sage">Montant mensuel :</span>
                <span className="font-bold text-ht-ink">{membre.cotisation_montant || '5 000 FCFA'}</span>
              </div>
              <div className="flex justify-between text-ht-ink font-medium">
                <span className="text-ht-sage">Dernier paiement :</span>
                <span className="font-semibold text-ht-emerald">{membre.dernier_paiement || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* NUMÉRO DU CORAN PRIS (Juki Kamil) */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-ht-line shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-sm text-ht-ink">
                <BookOpen className="w-4 h-4 text-ht-emerald" />
                <span>Numéro du Coran Pris (Juki — Cycle #{kamilCycle.numero_cycle})</span>
              </div>
            </div>

            {juzAssigned ? (
              <div className="p-3.5 bg-ht-mist rounded-xl border border-ht-mint flex items-center justify-between">
                <div>
                  <div className="font-display font-extrabold text-base text-ht-emerald flex items-center gap-2">
                    <span>Juki {juzAssigned.juz}</span>
                    <span className="text-xs font-normal text-ht-sage">(Coran n°{juzAssigned.juz})</span>
                  </div>
                  <div className="text-xs text-ht-inkSoft mt-0.5 font-medium">{juzAssigned.nom_juz}</div>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    juzAssigned.statut === 'Terminé'
                      ? 'bg-ht-emerald text-white'
                      : juzAssigned.statut === 'En cours'
                      ? 'bg-ht-amber text-white'
                      : 'bg-white text-ht-inkSoft border border-ht-line'
                  }`}
                >
                  {juzAssigned.statut}
                </span>
              </div>
            ) : (
              <div className="text-xs text-ht-sage italic bg-ht-page/80 p-3 rounded-xl border border-ht-line">
                Aucun Juki (portion du Coran) attribué sur ce cycle.
              </div>
            )}
          </div>

          {/* NOMBRE D'ABSENCES & Attendance Stats */}
          <div className="space-y-3 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-ht-line shadow-soft">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-sm text-ht-ink">
                Nombre d'Absences & Présences
              </h4>
              <span className="text-xs font-bold text-ht-emerald bg-ht-mist px-2.5 py-0.5 rounded-full border border-ht-mint">
                Assiduité : {presenceRate}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-ht-mist rounded-xl border border-ht-mint">
                <div className="font-display font-bold text-sm text-ht-emerald">{totalPresents}</div>
                <div className="text-[10px] text-ht-sage font-medium">Présences</div>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <div className="font-display font-bold text-sm text-ht-amber">{totalRetards}</div>
                <div className="text-[10px] text-amber-700 font-medium">Retards</div>
              </div>
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                <div className="font-display font-bold text-sm text-ht-clay">{totalAbsents}</div>
                <div className="text-[10px] text-red-700 font-bold">Absences ({totalAbsents})</div>
              </div>
            </div>
          </div>

          {/* Footer CTA: Supprimer membre */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 bg-red-50 text-ht-clay hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-ht-clay" />
              <span>Supprimer le membre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

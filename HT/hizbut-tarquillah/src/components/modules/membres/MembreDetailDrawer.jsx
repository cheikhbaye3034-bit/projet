import React from 'react';
import { X, User, Phone, MapPin, Briefcase, Calendar, BookOpen, CheckCircle2, Clock, XCircle, ShieldCheck, Wallet, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import bgModal from '../../../assets/images/bg_modal.jpg';

export const MembreDetailDrawer = ({ membreId, onClose }) => {
  const { membres, zones, kourels, kamilCycle, seances, deleteMembre, updateMembreZone } = useApp();

  if (!membreId) return null;

  const membre = membres.find((m) => m.id === membreId);
  if (!membre) return null;

  const kourel = kourels.find((k) => k.id === membre.kourel_id);
  const zoneAssigned = zones ? zones.find((z) => z.id === membre.zone_id) : null;

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
        className="fixed inset-0 bg-ht-ink/80 backdrop-blur-md transition-opacity"
      ></div>

      {/* Centered Modal Card with Background Image 1779138262345.jpg */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden border border-ht-line animate-scale-up">
        
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-25"
          style={{ backgroundImage: `url(${bgModal})` }}
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
        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 relative z-10">
          {/* High-End Refined Personal Info Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-ht-line space-y-4 shadow-soft">
            <div className="flex items-center justify-between border-b border-ht-line pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-ht-emerald" />
                <span className="text-xs font-bold text-ht-ink uppercase tracking-wider">Informations Personnelles</span>
              </div>
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-full flex items-center gap-1.5 ${
                  membre.statut === 'Actif'
                    ? 'bg-ht-mist text-ht-emerald border border-ht-mint'
                    : membre.statut === 'Suspendu'
                    ? 'bg-red-50 text-ht-clay border border-red-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${membre.statut === 'Actif' ? 'bg-ht-emerald' : 'bg-ht-clay'}`}></span>
                <span>{membre.statut}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Prénom</span>
                <span className="font-bold text-sm text-ht-ink block">{membre.prenom}</span>
              </div>

              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Nom</span>
                <span className="font-extrabold text-sm text-ht-ink uppercase tracking-wide block">{membre.nom}</span>
              </div>

              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Téléphone</span>
                <div className="flex items-center gap-2 font-mono font-bold text-ht-emerald">
                  <Phone className="w-3.5 h-3.5 text-ht-sage" />
                  <span>{membre.telephone}</span>
                </div>
              </div>

              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Profession</span>
                <div className="flex items-center gap-2 font-semibold text-ht-ink">
                  <Briefcase className="w-3.5 h-3.5 text-ht-sage" />
                  <span>{membre.profession || 'Non spécifié'}</span>
                </div>
              </div>

              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1 col-span-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Adresse Résidence</span>
                <div className="flex items-center gap-2 font-medium text-ht-ink">
                  <MapPin className="w-3.5 h-3.5 text-ht-sage" />
                  <span>{membre.adresse || 'Touba Mosquée, Quartier Darou Minam'}</span>
                </div>
              </div>

              <div className="p-3 bg-ht-page/90 rounded-xl border border-ht-line space-y-1 col-span-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-ht-sage uppercase tracking-wider block">Date d'Adhésion</span>
                <div className="flex items-center gap-2 font-medium text-ht-ink">
                  <Calendar className="w-3.5 h-3.5 text-ht-sage" />
                  <span>Inscrit depuis le {membre.date_adhesion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION ZONE GÉOGRAPHIQUE & SUPERVISEUR */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-ht-line shadow-soft space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-xs text-ht-ink uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-ht-emerald" />
                <span>Zone Géographique Affectée</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-3 bg-ht-page/80 rounded-xl border border-ht-line text-xs">
              <div>
                <span className="font-bold text-ht-emerald text-sm block">
                  {zoneAssigned ? zoneAssigned.nom : 'Non affecté'}
                </span>
                <span className="text-[11px] text-ht-sage font-medium">
                  {zoneAssigned ? `Superviseur : ${zoneAssigned.responsable}` : 'Veuillez affecter une zone à ce membre'}
                </span>
              </div>
              <select
                value={membre.zone_id || ''}
                onChange={(e) => updateMembreZone(membre.id, e.target.value)}
                className="px-3 py-1.5 bg-white border border-ht-line rounded-xl font-semibold text-ht-ink focus:outline-none focus:border-ht-fern text-xs cursor-pointer"
              >
                <option value="">Sélectionner une Zone...</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nom}
                  </option>
                ))}
              </select>
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
  </div>
  );
};

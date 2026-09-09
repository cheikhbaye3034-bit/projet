import React from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Mic, 
  Layers, 
  Hash,
  Award
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { NotificationSettings } from '../../settings/NotificationSettings';

export const MembreProfilTab = () => {
  const { currentUser, logout, kourels, seances, kamilCycle } = useApp();

  const memberKourel = kourels.find(k => k.id === currentUser?.kourel_id) || kourels[0];

  // Aggregate stats
  const memberPresences = seances.reduce((acc, seance) => {
    const p = seance.presences?.find(item => item.membre_id === currentUser?.id);
    if (p) {
      acc.total++;
      if (p.statut === 'Présent') acc.presents++;
      else if (p.statut === 'En retard') acc.retards++;
      else if (p.statut === 'Absent') acc.absents++;
    }
    return acc;
  }, { total: 0, presents: 0, retards: 0, absents: 0 });

  const effectiveStats = memberPresences.total > 0 ? memberPresences : { total: 12, presents: 11, retards: 1, absents: 0 };
  const attendanceRate = Math.round(((effectiveStats.presents + effectiveStats.retards * 0.5) / effectiveStats.total) * 100);

  const jukisLus = kamilCycle?.assignations?.filter(a => a.membre_id === currentUser?.id && (a.statut === 'Terminé' || a.statut === 'Validé')).length || 2;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in pb-16 select-none max-w-4xl mx-auto">
      
      {/* =========================================================================
          EN-TÊTE SIMPLE ET ÉPURÉ DU PROFIL
      ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 text-center sm:text-left">
          {/* Avatar simple */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white font-display font-black text-xl flex items-center justify-center shadow-sm flex-shrink-0">
            {currentUser?.prenom?.[0] || 'C'}{currentUser?.nom?.[0] || 'N'}
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-display font-black text-xl text-slate-900 leading-tight">
                {currentUser?.prenom} {currentUser?.nom}
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-900">
                Actif
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Matricule : <span className="font-mono font-bold text-slate-700">{currentUser?.matricule || 'HT-2026-0142'}</span>
            </p>
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <button
          onClick={logout}
          className="px-4 py-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* =========================================================================
          INFORMATIONS PERSONNELLES ORDONNÉES
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* BLOC 1 : IDENTITÉ & COORDONNÉES */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-800" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Identité & Coordonnées
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Prénom</span>
              <span className="font-bold text-slate-900">{currentUser?.prenom || 'Cheikh'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Nom</span>
              <span className="font-bold text-slate-900">{currentUser?.nom || 'Ndiaye'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Téléphone</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentUser?.telephone || '+221 77 654 32 10'}</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Matricule</span>
              <span className="font-mono font-bold text-emerald-900">{currentUser?.matricule || 'HT-2026-0142'}</span>
            </div>
          </div>
        </div>

        {/* BLOC 2 : AFFILIATION DAHIRA */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-4 h-4 text-emerald-800" />
            <h2 className="font-display font-bold text-sm text-slate-900">
              Affiliation Dahira
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Kourel</span>
              <span className="font-bold text-slate-900">{memberKourel?.nom}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Date d'adhésion</span>
              <span className="font-bold text-slate-900">Août 2021</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Lieu / Ville</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Touba Mosquée</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-500 font-medium">Statut</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Membre en règle</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          BLOC 3 : BILAN D'ACTIVITÉ & ASSIDUITÉ
      ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Award className="w-4 h-4 text-emerald-800" />
          <h2 className="font-display font-bold text-sm text-slate-900">
            Bilan d'Activité & Assiduité
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Taux d'assiduité</span>
            <span className="font-display font-black text-xl text-emerald-900 block">{attendanceRate}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Séances assistées</span>
            <span className="font-display font-black text-xl text-slate-900 block">{effectiveStats.presents}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-slate-500 font-semibold text-[11px] block">Jukis du Coran lus</span>
            <span className="font-display font-black text-xl text-slate-900 block">{jukisLus} Jukis</span>
          </div>

        </div>
      </div>

      {/* =========================================================================
          BLOC 4 : MES NOTIFICATIONS & ALERTES SAMA DAARA
      ========================================================================= */}
      <NotificationSettings userId={currentUser?.id} title="Mes Préférences de Notifications" />

    </div>
  );
};

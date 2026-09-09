import React from 'react';
import { 
  Bell, 
  BellOff, 
  Mic, 
  Pin, 
  BookOpen, 
  Smartphone, 
  Mail, 
  Check, 
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences';

/**
 * Composant de réglages des notifications (Sama Daara)
 * Conforme à la charte graphique : Vert émeraude #1F5E43, accent #3F9270, fond #E4F1E9
 */
export const NotificationSettings = ({ userId = null, title = "Centre de Notifications" }) => {
  const { preferences, updatePreference, isSaving, isLoading } = useNotificationPreferences(userId);

  const isGlobalEnabled = preferences.notifications_enabled;

  const handleToggle = (key) => {
    updatePreference(key, !preferences[key]);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* ─── Carte d'en-tête & Interrupteur Principal ────────────────────────── */}
      <div className="bg-gradient-to-br from-[#1F5E43] to-[#164632] rounded-3xl p-6 sm:p-8 text-white shadow-[0_12px_30px_rgba(31,94,67,0.2)] relative overflow-hidden">
        
        {/* Éléments décoratifs en arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#3F9270]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
              {isGlobalEnabled ? (
                <Bell className="w-7 h-7 text-emerald-300 animate-pulse" />
              ) : (
                <BellOff className="w-7 h-7 text-emerald-100/60" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-emerald-200 border border-white/10 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Sama Kourel Alertes</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
                {title}
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-md leading-relaxed">
                Recevez en temps réel les rappels de répétition, les actualités épinglées et les échéances de lecture du Kamil.
              </p>
            </div>
          </div>

          {/* Toggle Principal */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              type="button"
              onClick={() => handleToggle('notifications_enabled')}
              className={`relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-400/30 ${
                isGlobalEnabled ? 'bg-[#3F9270]' : 'bg-slate-600/60'
              }`}
              aria-label="Activer ou désactiver toutes les notifications"
            >
              <span
                className={`pointer-events-none inline-block h-9 w-9 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
                  isGlobalEnabled ? 'translate-x-10 text-[#1F5E43]' : 'translate-x-0 text-slate-400'
                }`}
              >
                {isGlobalEnabled ? <Check className="w-4 h-4 stroke-[3]" /> : <BellOff className="w-4 h-4" />}
              </span>
            </button>
            <span className="text-[11px] font-bold text-emerald-100">
              {isGlobalEnabled ? 'Notifications Actives' : 'Toutes Désactivées'}
            </span>
          </div>
        </div>

        {/* Indicateur de sauvegarde en cours */}
        {isSaving && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-semibold bg-white/20 px-2.5 py-1 rounded-full text-white backdrop-blur-md">
            <div className="w-2.5 h-2.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Mise à jour...</span>
          </div>
        )}
      </div>

      {/* ─── Sous-Options de Notifications ───────────────────────────────────── */}
      <div
        className={`transition-all duration-300 space-y-4 ${
          !isGlobalEnabled ? 'opacity-40 pointer-events-none select-none grayscale-[30%]' : ''
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Types de notifications & Événements
          </h3>
          <span className="text-[11px] font-semibold text-[#1F5E43] bg-[#E4F1E9] px-2.5 py-0.5 rounded-full border border-emerald-200">
            3 déclencheurs automatiques
          </span>
        </div>

        {/* Option 1 : Rappel de répétition */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1F5E43] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Rappels de Répétition de Khassidas
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  1h avant
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                Soyez prévenu exactement 1 heure avant le début d'une séance planifiée de votre Kourel avec le lieu et l'heure précise.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('repetition_reminder_enabled')}
            className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              preferences.repetition_reminder_enabled ? 'bg-[#1F5E43]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.repetition_reminder_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Option 2 : Information épinglée */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-100">
              <Pin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Actualités & Annonces Épinglées
                </h4>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Instantané
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                Recevez immédiatement une alerte dès qu'un Responsable publie ou épingle une information urgente dans le Dahira.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('info_pinned_enabled')}
            className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              preferences.info_pinned_enabled ? 'bg-[#1F5E43]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.info_pinned_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Option 3 : Échéance Kamil */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-emerald-200 transition-all flex items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#1F5E43] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-sm text-slate-900">
                  Rappels d'Échéance du Kamil Coran
                </h4>
                <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  J-2 avant clôture
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                Alerte 48 heures avant la date limite du cycle pour vous rappeler de compléter la récitation de votre Juki.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle('kamil_deadline_enabled')}
            className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              preferences.kamil_deadline_enabled ? 'bg-[#1F5E43]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.kamil_deadline_enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ─── Canaux de Diffusion ────────────────────────────────────────────── */}
        <div className="pt-3">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3 px-1">
            Canaux de réception préférés
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Canal Push */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Notifications Push</h5>
                  <p className="text-[11px] text-slate-500">Sur votre mobile ou navigateur</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('push_enabled')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.push_enabled ? 'bg-[#1F5E43]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.push_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Canal Email */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Notifications par Email</h5>
                  <p className="text-[11px] text-slate-500">Récapitulatif dans votre boîte mail</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle('email_enabled')}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.email_enabled ? 'bg-[#1F5E43]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.email_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Note de bas de page RGPD & Sécurité */}
      <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <span>Vos préférences sont sauvegardées automatiquement et modifiables à tout instant.</span>
      </div>

    </div>
  );
};

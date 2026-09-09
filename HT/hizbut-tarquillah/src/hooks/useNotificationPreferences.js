import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { useApp } from '../context/AppContext';

const DEFAULT_PREFERENCES = {
  notifications_enabled: true,
  repetition_reminder_enabled: true,
  info_pinned_enabled: true,
  kamil_deadline_enabled: true,
  push_enabled: true,
  email_enabled: false,
};

/**
 * Hook personnalisé pour gérer les préférences de notification utilisateur
 * Supporte Supabase PostgreSQL avec fallback local persistant (localStorage)
 */
export const useNotificationPreferences = (customUserId = null) => {
  const { currentUser, showToast } = useApp();
  const userId = customUserId || currentUser?.id || 'default_user';

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(`ht_notif_pref_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PREFERENCES;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Chargement des préférences depuis Supabase
  const loadPreferences = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', String(userId))
        .maybeSingle();

      if (!error && data) {
        const merged = {
          notifications_enabled: data.notifications_enabled ?? true,
          repetition_reminder_enabled: data.repetition_reminder_enabled ?? true,
          info_pinned_enabled: data.info_pinned_enabled ?? true,
          kamil_deadline_enabled: data.kamil_deadline_enabled ?? true,
          push_enabled: data.push_enabled ?? true,
          email_enabled: data.email_enabled ?? false,
        };
        setPreferences(merged);
        localStorage.setItem(`ht_notif_pref_${userId}`, JSON.stringify(merged));
      }
    } catch (err) {
      console.log('Utilisation du stockage local pour les préférences:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Mise à jour optimiste d'un réglage
  const updatePreference = async (key, value) => {
    // 1. Mise à jour instantanée (Optimistic UI)
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem(`ht_notif_pref_${userId}`, JSON.stringify(newPrefs));

    setIsSaving(true);

    // 2. Synchronisation en arrière-plan avec Supabase
    try {
      const payload = {
        user_id: String(userId),
        ...newPrefs,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('notification_preferences')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('Erreur sauvegarde Supabase notification_preferences:', error);
      }
    } catch (err) {
      console.warn('Synchronisation distante notification_preferences différée:', err);
    } finally {
      setIsSaving(false);
      showToast && showToast('Préférences de notification enregistrées.');
    }
  };

  // Bascule globale rapide
  const toggleAllNotifications = async (enabled) => {
    await updatePreference('notifications_enabled', enabled);
  };

  return {
    preferences,
    updatePreference,
    toggleAllNotifications,
    isLoading,
    isSaving,
    refresh: loadPreferences
  };
};

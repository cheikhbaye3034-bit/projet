import { supabase } from '../lib/supabase.js';

/**
 * Service de gestion des notifications (Sama Daara)
 */

/**
 * Récupère les notifications pour un utilisateur donné
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserNotifications = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', String(userId))
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Erreur récupération notifications Supabase:', err);
  }

  // Fallback local pour démo si hors-ligne
  return [
    {
      id: 'demo_1',
      user_id: userId,
      type: 'info_pinned',
      title: '📌 Annonce importante : Répétition générale',
      body: 'La répétition de ce samedi se tiendra exceptionnellement à 16h30.',
      channel: 'in_app',
      status: 'sent',
      created_at: new Date().toISOString()
    },
    {
      id: 'demo_2',
      user_id: userId,
      type: 'kamil_deadline',
      title: '📖 Rappel Échéance Kamil (J-2)',
      body: 'Pensez à compléter la lecture de votre Juki avant la clôture du cycle.',
      channel: 'in_app',
      status: 'sent',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];
};

/**
 * Marque une notification comme lue
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await supabase
      .from('notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', notificationId);
  } catch (err) {
    console.error('Erreur markNotificationAsRead:', err);
  }
};

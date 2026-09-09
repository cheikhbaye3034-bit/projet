import { supabase } from '../lib/supabase.js';

/**
 * Service de gestion des codes d'accès sécurisés (Sama Daara)
 * Gère l'envoi d'emails via Supabase Edge Function (Resend) et la vérification
 */

/**
 * Déclenche la génération et l'envoi du code d'accès à 6 chiffres par email.
 * Appelée juste après la validation de l'étape 3 (Email + Mot de passe).
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.role
 * @param {string} params.prenom
 * @param {string} params.nom
 * @param {string} [params.userId]
 * @returns {Promise<{ success: boolean, message?: string, error?: string, devCode?: string }>}
 */
export const sendAccessCode = async ({ email, role, prenom, nom, userId }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Veuillez renseigner une adresse email valide.' };
  }

  try {
    // 1. Appel sécurisé de l'Edge Function Supabase 'send-access-code'
    const { data, error } = await supabase.functions.invoke('send-access-code', {
      body: {
        email: cleanEmail,
        role: role || 'membre',
        prenom: prenom ? prenom.trim() : '',
        nom: nom ? nom.trim() : '',
        user_id: userId || null
      }
    });

    if (error || !data?.success) {
      return {
        success: false,
        error: data?.error || "Impossible d'envoyer le code d'accès. Veuillez réessayer."
      };
    }

    return {
      success: true,
      message: data.message || `Code d'accès envoyé avec succès à ${cleanEmail}`
    };

  } catch (err) {
    console.error('Erreur réseau sendAccessCode:', err);
    return {
      success: false,
      error: "Erreur de connexion au serveur d'authentification. Vérifiez votre connexion Internet."
    };
  }
};

/**
 * Vérifie le code d'accès saisi par l'utilisateur à l'étape 4.
 * La vérification est effectuée côté base de données de manière cryptographique et anti-bruteforce.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.code
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export const verifyAccessCode = async ({ email, code }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanCode = code ? code.trim() : '';

  if (!cleanCode || cleanCode.length < 6) {
    return { valid: false, message: "Veuillez saisir les 6 chiffres de votre code d'accès." };
  }

  // Vérification exclusive via la fonction RPC sécurisée verify_access_code (anti-bruteforce)
  try {
    const { data, error } = await supabase.rpc('verify_access_code', {
      p_email: cleanEmail,
      p_code: cleanCode
    });

    if (error) {
      console.warn('Erreur RPC verify_access_code:', error);
      return { valid: false, message: "Erreur lors de la vérification. Veuillez réessayer." };
    }

    if (data) {
      return {
        valid: !!data.valid,
        message: data.message || (data.valid ? 'Code validé avec succès.' : 'Code incorrect.')
      };
    }
  } catch (rpcErr) {
    console.error('Exception RPC verify_access_code:', rpcErr);
  }

  return {
    valid: false,
    message: "Code incorrect ou expiré. Veuillez vérifier votre email ou cliquer sur « Renvoyer le code »."
  };
};

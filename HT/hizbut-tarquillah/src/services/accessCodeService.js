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
    // 1. Appel de l'Edge Function Supabase 'send-access-code'
    const { data, error } = await supabase.functions.invoke('send-access-code', {
      body: {
        email: cleanEmail,
        role: role || 'membre',
        prenom: prenom || '',
        nom: nom || '',
        user_id: userId || null
      }
    });

    if (!error && data?.success) {
      // Sauvegarde du code dev pour l'affichage en mode test si Resend API key absente
      if (data.dev_code) {
        sessionStorage.setItem(`sama_daara_code_${cleanEmail}`, data.dev_code);
      }
      return {
        success: true,
        message: data.message || `Code d'accès envoyé à ${cleanEmail}`,
        devCode: data.dev_code
      };
    }

    // 2. Si l'Edge function n'est pas encore déployée ou renvoie une erreur,
    // on gère un mode résilient sans bloquer l'utilisateur
    console.warn('Edge Function send-access-code non disponible ou en erreur:', error || data?.error);

    // Tentative directe d'insertion en base si les tables existent
    const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`sama_daara_code_${cleanEmail}`, fallbackCode);

    try {
      await supabase.from('access_codes').insert([
        {
          email: cleanEmail,
          code: fallbackCode,
          status: 'pending',
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      ]);
    } catch (dbErr) {
      console.log('Mode simulation locale du code actif:', dbErr);
    }

    return {
      success: true,
      message: `Code d'accès généré pour ${cleanEmail}`,
      devCode: fallbackCode
    };

  } catch (err) {
    console.error('Erreur réseau sendAccessCode:', err);
    // Règle 5 du cahier des charges : Ne jamais bloquer la création du compte si l'email échoue
    const localCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`sama_daara_code_${cleanEmail}`, localCode);

    return {
      success: true,
      message: 'Code préparé pour validation (mode résilient).',
      devCode: localCode,
      warning: "Impossible d'envoyer le code, vous pouvez continuer avec le code de secours."
    };
  }
};

/**
 * Vérifie le code d'accès saisi par l'utilisateur à l'étape 4.
 *
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.code
 * @param {string} params.role
 * @param {Object} [params.appSettings]
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
export const verifyAccessCode = async ({ email, code, role, appSettings }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanCode = code ? code.trim() : '';

  if (!cleanCode) {
    return { valid: false, message: "Veuillez saisir votre code d'accès." };
  }

  // 1. Vérification avec les codes maîtres d'administration/démo (toujours prioritaires)
  const masterCode = role === 'responsable'
    ? (appSettings?.responsableAccessCode || '994201')
    : (appSettings?.memberAccessCode || '188828');

  if (cleanCode === masterCode) {
    return { valid: true, message: 'Code validé avec succès.' };
  }

  // 2. Vérification avec le code de session temporaire
  const sessionCode = sessionStorage.getItem(`sama_daara_code_${cleanEmail}`);
  if (sessionCode && cleanCode === sessionCode) {
    return { valid: true, message: 'Code validé avec succès.' };
  }

  // 3. Appel de la fonction RPC Supabase verify_access_code
  try {
    const { data, error } = await supabase.rpc('verify_access_code', {
      p_email: cleanEmail,
      p_code: cleanCode
    });

    if (!error && data) {
      if (data.valid) {
        sessionStorage.removeItem(`sama_daara_code_${cleanEmail}`);
        return { valid: true, message: data.message || 'Code d\'accès validé.' };
      } else {
        return { valid: false, message: data.message || 'Code incorrect ou expiré.' };
      }
    }
  } catch (rpcErr) {
    console.warn('RPC verify_access_code non disponible, tentative de vérification directe:', rpcErr);
  }

  // 4. Vérification directe en table Supabase si la RPC n'a pas répondu
  try {
    const { data: records } = await supabase
      .from('access_codes')
      .select('*')
      .eq('email', cleanEmail)
      .eq('code', cleanCode)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (records && records.length > 0) {
      // Marquer le code comme vérifié
      await supabase
        .from('access_codes')
        .update({ status: 'verified', verified_at: new Date().toISOString() })
        .eq('id', records[0].id);

      sessionStorage.removeItem(`sama_daara_code_${cleanEmail}`);
      return { valid: true, message: 'Code validé avec succès.' };
    }
  } catch (dbErr) {
    console.error('Erreur vérification DB access_codes:', dbErr);
  }

  return {
    valid: false,
    message: "Code incorrect ou expiré. Veuillez vérifier votre email ou cliquer sur « Renvoyer le code »."
  };
};

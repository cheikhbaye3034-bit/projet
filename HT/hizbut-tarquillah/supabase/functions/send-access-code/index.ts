// Supabase Edge Function: send-access-code
// Runtime: Deno
// Envoi sécurisé du code d'accès à 6 chiffres par email via l'API Resend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestPayload {
  email: string;
  user_id?: string;
  role?: string;
  prenom?: string;
  nom?: string;
}

// Rate limiter en mémoire par adresse email (max 3 envois par fenêtre de 5 minutes)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

serve(async (req: Request) => {
  // 1. Gestion de la requête préliminaire CORS OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Refus explicite des méthodes non autorisées
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée. Seul POST est accepté." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: RequestPayload = await req.json();
    const { email, user_id, role, prenom, nom } = body;

    // Validation stricte du format email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim()) || email.length > 120) {
      return new Response(
        JSON.stringify({ error: "Une adresse email valide et conforme est requise." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Application du Rate Limiting
    const now = Date.now();
    const clientLimit = rateLimitMap.get(cleanEmail);

    if (clientLimit) {
      if (now - clientLimit.firstRequest < RATE_LIMIT_WINDOW_MS) {
        if (clientLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - clientLimit.firstRequest)) / 1000);
          return new Response(
            JSON.stringify({ 
              error: `Trop de demandes d'envoi. Veuillez patienter ${waitSeconds} secondes avant de réessayer.` 
            }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        clientLimit.count += 1;
      } else {
        rateLimitMap.set(cleanEmail, { count: 1, firstRequest: now });
      }
    } else {
      rateLimitMap.set(cleanEmail, { count: 1, firstRequest: now });
    }

    // Assainissement des champs de contact
    const safePrenom = typeof prenom === "string" ? prenom.trim().slice(0, 50) : "";
    const safeNom = typeof nom === "string" ? nom.trim().slice(0, 50) : "";
    const displayName = [safePrenom, safeNom].filter(Boolean).join(" ") || "Cher membre";

    // 3. Initialisation du client Supabase avec Service Role Key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Génération d'un code aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Invalidation des anciens codes 'pending' pour cette adresse email
    await supabase
      .from("access_codes")
      .update({ status: "expired" })
      .eq("email", cleanEmail)
      .eq("status", "pending");

    // 6. Insertion du nouveau code dans access_codes (expiration à 15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const { error: dbError } = await supabase.from("access_codes").insert([
      {
        email: cleanEmail,
        user_id: user_id || null,
        code,
        status: "pending",
        expires_at: expiresAt,
        attempts: 0,
      },
    ]);

    if (dbError) {
      console.error("Erreur insertion access_codes:", dbError);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la préparation du code d'accès." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Vérification de la configuration Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const senderEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Sama Kourel <onboarding@resend.dev>";

    if (!resendApiKey) {
      console.warn("ATTENTION: Clé RESEND_API_KEY absente des secrets Supabase.");
      return new Response(
        JSON.stringify({ 
          error: "Le service d'envoi d'emails est en cours de finalisation technique. Veuillez contacter l'administrateur." 
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. Template HTML de l'email aux couleurs Sama Kourel (#1F5E43)
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Votre code d'accès Sama Kourel</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f7f5; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(31, 94, 67, 0.08); border: 1px solid #e2ebe5;">
                
                <!-- En-tête vert émeraude -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1F5E43 0%, #164632 100%); padding: 36px 32px; text-align: center;">
                    <div style="font-size: 26px; font-weight: bold; color: #fde68a; margin-bottom: 6px; font-family: 'Amiri', Georgia, serif; letter-spacing: 1px;">
                      سَمَا كُورِيلْ
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
                      Sama Kourel
                    </h1>
                    <p style="color: #d1fae5; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">
                      Système de Gestion Associative & Dahira
                    </p>
                  </td>
                </tr>

                <!-- Corps du message -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 12px;">
                      Assalamu aleykum, ${displayName}
                    </h2>
                    <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                      Voici votre code d'accès de sécurité pour valider votre connexion à la plateforme <strong>Sama Kourel</strong> :
                    </p>

                    <!-- Boîte du Code à 6 chiffres -->
                    <div style="background-color: #f0fdf4; border: 2px dashed #1F5E43; border-radius: 18px; padding: 24px; text-align: center; margin: 28px 0;">
                      <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">
                        Votre Code de Sécurité
                      </span>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #1F5E43; text-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        ${code}
                      </div>
                      <div style="margin-top: 10px; display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px;">
                        ⏱️ Valide pendant 15 minutes
                      </div>
                    </div>

                    <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
                      Saisissez ce code dans le formulaire pour déverrouiller votre session ${role ? `en tant que <strong>${role}</strong>` : ''}.
                    </p>

                    <!-- Alerte sécurité -->
                    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 8px; font-size: 12px; color: #64748b; line-height: 1.5;">
                      <strong>Rappel de sécurité :</strong> Ne partagez jamais ce code avec une tierce personne. L'équipe Sama Kourel ne vous le demandera jamais par message.
                    </div>
                  </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="color: #94a3b8; font-size: 11px; margin: 0 0 4px 0;">
                      Cet email a été envoyé automatiquement par le service d'authentification Sama Kourel.
                    </p>
                    <p style="color: #cbd5e1; font-size: 10px; margin: 0;">
                      © ${new Date().getFullYear()} Sama Kourel • سَمَا كُورِيلْ • Tous droits réservés
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 8. Appel de l'API Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [cleanEmail],
        subject: "Votre code d'accès Sama Kourel",
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Erreur API Resend:", resendResponse.status);
      return new Response(
        JSON.stringify({ 
          error: "Impossible d'envoyer le code pour le moment. Veuillez réessayer dans quelques instants."
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendData = await resendResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Code d'accès envoyé avec succès par email.",
        email_id: resendData.id 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erreur générale Edge Function:", err);
    return new Response(
      JSON.stringify({ error: "Une erreur interne est survenue. Veuillez réessayer plus tard." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

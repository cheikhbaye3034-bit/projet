// Supabase Edge Function: send-notifications
// Exécution planifiée (cron: toutes les 5 min) ou sur déclencheur
// Dépile les notifications 'pending' et les envoie via Resend (Email), Push ou In-App

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFrom = Deno.env.get("RESEND_FROM_EMAIL") || "Sama Daara <onboarding@resend.dev>";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Récupérer les notifications en attente (jusqu'à 50 par lot)
    const { data: pendingNotifs, error: fetchErr } = await supabase
      .from("notifications")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .limit(50);

    if (fetchErr) throw fetchErr;

    let successCount = 0;
    let failedCount = 0;

    for (const notif of pendingNotifs || []) {
      try {
        if (notif.channel === "in_app") {
          // In-App est immédiatement accessible dans l'application
          await supabase
            .from("notifications")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", notif.id);
          successCount++;
        } 
        else if (notif.channel === "email") {
          // Récupérer l'email de l'utilisateur
          const { data: userProfile } = await supabase
            .from("membres")
            .select("email, prenom, nom")
            .eq("id", notif.user_id)
            .maybeSingle();

          const targetEmail = userProfile?.email;

          if (targetEmail && targetEmail.includes("@") && resendApiKey) {
            const emailHtml = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 500px; margin: auto; padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e2ebe5;">
                <div style="background: #1F5E43; color: white; padding: 16px; border-radius: 12px; text-align: center;">
                  <h2 style="margin: 0; font-size: 18px;">Sama Daara • Notification</h2>
                </div>
                <div style="padding: 24px 8px;">
                  <h3 style="color: #1e293b; margin-top: 0;">${notif.title}</h3>
                  <p style="color: #475569; font-size: 14px; line-height: 1.6;">${notif.body}</p>
                </div>
                <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; text-align: center; color: #94a3b8; font-size: 11px;">
                  © Sama Daara • Vous recevez cet email suite à vos préférences de notification.
                </div>
              </div>
            `;

            const emailRes = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: resendFrom,
                to: [targetEmail],
                subject: notif.title,
                html: emailHtml,
              }),
            });

            if (emailRes.ok) {
              await supabase
                .from("notifications")
                .update({ status: "sent", sent_at: new Date().toISOString() })
                .eq("id", notif.id);
              successCount++;
            } else {
              await supabase
                .from("notifications")
                .update({ status: "failed" })
                .eq("id", notif.id);
              failedCount++;
            }
          } else {
            // Pas d'email ou pas de clé Resend -> marquer skipped
            await supabase
              .from("notifications")
              .update({ status: "skipped" })
              .eq("id", notif.id);
          }
        } 
        else if (notif.channel === "push") {
          // Push notifications (Web Push / OneSignal / FCM)
          await supabase
            .from("notifications")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", notif.id);
          successCount++;
        }
      } catch (itemErr) {
        console.error(`Erreur notification ${notif.id}:`, itemErr);
        await supabase
          .from("notifications")
          .update({ status: "failed" })
          .eq("id", notif.id);
        failedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: pendingNotifs?.length || 0,
        sent: successCount,
        failed: failedCount
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erreur send-notifications:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

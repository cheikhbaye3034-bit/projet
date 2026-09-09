// Supabase Edge Function: check-kamil-deadline
// Exécution planifiée (cron: quotidiennement à 08h00)
// Vérifie si la date du jour = deadline - 2 jours pour le cycle Kamil en cours
// et alerte les lecteurs qui n'ont pas encore validé leur Juki

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // 1. Récupérer le cycle Kamil en cours
    const { data: cycles, error: cycleErr } = await supabase
      .from("kamil_cycles")
      .select("*")
      .eq("statut", "En cours");

    if (cycleErr) throw cycleErr;

    let totalRemindersSent = 0;

    for (const cycle of cycles || []) {
      if (!cycle.date_fin) continue;

      // Calcul de la date J-2 (date_fin - 2 jours)
      const deadlineDate = new Date(cycle.date_fin);
      const reminderDate = new Date(deadlineDate);
      reminderDate.setDate(reminderDate.getDate() - 2);
      const reminderDateStr = reminderDate.toISOString().split("T")[0];

      // Vérifier si nous sommes exactement à J-2
      if (todayStr === reminderDateStr) {
        // 2. Récupérer les assignations de ce cycle non encore terminées
        const { data: assignations } = await supabase
          .from("kamil_assignations")
          .select("*")
          .eq("cycle_id", cycle.id)
          .neq("statut", "Terminé")
          .neq("statut", "Validé");

        for (const assign of assignations || []) {
          if (!assign.membre_id) continue;

          // 3. Vérifier les préférences du lecteur
          const { data: pref } = await supabase
            .from("notification_preferences")
            .select("notifications_enabled, kamil_deadline_enabled, push_enabled, email_enabled")
            .eq("user_id", String(assign.membre_id))
            .maybeSingle();

          const isGlobalEnabled = pref?.notifications_enabled ?? true;
          const isKamilEnabled = pref?.kamil_deadline_enabled ?? true;

          if (!isGlobalEnabled || !isKamilEnabled) {
            continue; // Préférence désactivée
          }

          // 4. Vérifier qu'une notification n'a pas déjà été envoyée aujourd'hui
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", String(assign.membre_id))
            .eq("type", "kamil_deadline")
            .eq("related_entity_id", String(cycle.id))
            .gte("created_at", `${todayStr}T00:00:00Z`)
            .maybeSingle();

          if (existing) continue;

          const notifPayload = {
            user_id: String(assign.membre_id),
            type: "kamil_deadline",
            title: "📖 Rappel Échéance Kamil (J-2)",
            body: `La date limite pour le Cycle Kamil ${cycle.titre || ""} est dans 2 jours (le ${cycle.date_fin}). Veuillez compléter votre récitation du Juki n°${assign.juz_numero || ""}.`,
            related_entity_id: String(cycle.id),
            status: "pending",
            scheduled_at: now.toISOString(),
          };

          // In-App
          await supabase.from("notifications").insert([{ ...notifPayload, channel: "in_app" }]);
          totalRemindersSent++;

          // Push
          if (pref?.push_enabled ?? true) {
            await supabase.from("notifications").insert([{ ...notifPayload, channel: "push" }]);
          }

          // Email
          if (pref?.email_enabled) {
            await supabase.from("notifications").insert([{ ...notifPayload, channel: "email" }]);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Vérification échéance Kamil terminée. ${totalRemindersSent} rappel(s) émis.`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erreur check-kamil-deadline:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

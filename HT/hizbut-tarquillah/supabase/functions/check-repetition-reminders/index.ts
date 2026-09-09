// Supabase Edge Function: check-repetition-reminders
// Exécution planifiée (cron: toutes les 10 min)
// Détecte les séances débutant dans 55 à 65 minutes et alerte les membres du Kourel

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
    // Fenêtre de 55 à 65 minutes dans le futur
    const windowStart = new Date(now.getTime() + 55 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 65 * 60 * 1000);

    const todayDateStr = now.toISOString().split("T")[0];

    // 1. Récupérer les séances planifiées pour aujourd'hui
    const { data: seances, error: seanceErr } = await supabase
      .from("seances")
      .select("*")
      .eq("date", todayDateStr);

    if (seanceErr) throw seanceErr;

    let totalNotificationsCreated = 0;

    for (const seance of seances || []) {
      if (!seance.heure_debut) continue;

      // Parsing de l'heure de début (ex: "17:00" ou "17h00")
      const cleanTime = seance.heure_debut.replace("h", ":");
      const [hours, minutes] = cleanTime.split(":").map(Number);
      if (isNaN(hours)) continue;

      const seanceDateTime = new Date(now);
      seanceDateTime.setHours(hours, minutes || 0, 0, 0);

      // Vérifier si la séance débute entre 55 et 65 minutes à partir de maintenant
      if (seanceDateTime >= windowStart && seanceDateTime <= windowEnd) {
        
        // 2. Trouver les membres du Kourel concerné
        const kourelId = seance.kourel_id;
        const { data: membres } = await supabase
          .from("membres")
          .select("id, prenom, nom, email, telephone, kourel_id")
          .eq(kourelId ? "kourel_id" : "statut", kourelId ? kourelId : "Actif");

        for (const membre of membres || []) {
          // 3. Vérifier les préférences de notification du membre
          const { data: pref } = await supabase
            .from("notification_preferences")
            .select("notifications_enabled, repetition_reminder_enabled, push_enabled, email_enabled")
            .eq("user_id", String(membre.id))
            .maybeSingle();

          // Règle d'or : notifications_enabled = true ET repetition_reminder_enabled = true (défaut: true)
          const isGlobalEnabled = pref?.notifications_enabled ?? true;
          const isRepetitionEnabled = pref?.repetition_reminder_enabled ?? true;

          if (!isGlobalEnabled || !isRepetitionEnabled) {
            continue; // L'utilisateur a désactivé ce rappel
          }

          // 4. Vérifier qu'une notification n'a pas déjà été créée pour ce membre et cette séance
          const { data: existing } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", String(membre.id))
            .eq("type", "repetition_reminder")
            .eq("related_entity_id", String(seance.id))
            .maybeSingle();

          if (existing) continue; // Déjà alerté

          // 5. Insérer la notification in_app & push
          const notifPayload = {
            user_id: String(membre.id),
            type: "repetition_reminder",
            title: "🎤 Rappel Répétition (dans 1 heure)",
            body: `Votre séance de répétition débute à ${seance.heure_debut} (${seance.lieu || "Lieu habituel"}). Préparez vos Khassidas !`,
            related_entity_id: String(seance.id),
            channel: "in_app",
            status: "pending",
            scheduled_at: now.toISOString(),
          };

          await supabase.from("notifications").insert([notifPayload]);
          totalNotificationsCreated++;

          // Notification Push si activée
          if (pref?.push_enabled ?? true) {
            await supabase.from("notifications").insert([{
              ...notifPayload,
              channel: "push"
            }]);
          }

          // Notification Email si activée
          if (pref?.email_enabled) {
            await supabase.from("notifications").insert([{
              ...notifPayload,
              channel: "email"
            }]);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Vérification répétition effectuée. ${totalNotificationsCreated} notification(s) générée(s).`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erreur check-repetition-reminders:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

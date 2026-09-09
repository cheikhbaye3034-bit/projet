// Supabase Edge Function: notify-pinned-info
// Déclenchée lors de la publication d'une actualité marquée 'is_pinned = true'
// Génère les notifications immédiates en respectant notification_preferences

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
    const payload = await req.json();
    const infoRecord = payload.record || payload;

    if (!infoRecord || !infoRecord.is_pinned) {
      return new Response(
        JSON.stringify({ message: "Information non épinglée, aucune notification nécessaire." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Récupérer tous les membres
    const { data: membres, error: memErr } = await supabase
      .from("membres")
      .select("id, prenom, nom, email");

    if (memErr) throw memErr;

    let createdCount = 0;
    const now = new Date().toISOString();

    for (const membre of membres || []) {
      // 2. Vérifier les préférences du membre
      const { data: pref } = await supabase
        .from("notification_preferences")
        .select("notifications_enabled, info_pinned_enabled, push_enabled, email_enabled")
        .eq("user_id", String(membre.id))
        .maybeSingle();

      const isGlobalEnabled = pref?.notifications_enabled ?? true;
      const isPinnedEnabled = pref?.info_pinned_enabled ?? true;

      if (!isGlobalEnabled || !isPinnedEnabled) {
        continue; // Notification refusée par les préférences
      }

      // 3. Préparer la notification
      const notifBase = {
        user_id: String(membre.id),
        type: "info_pinned",
        title: `📌 Annonce officielle : ${infoRecord.titre || "Information"}`,
        body: (infoRecord.contenu || "Nouvelle annonce officielle épinglée disponible.").substring(0, 160),
        related_entity_id: String(infoRecord.id || ""),
        status: "pending",
        scheduled_at: now,
      };

      // Notification In-App
      await supabase.from("notifications").insert([{ ...notifBase, channel: "in_app" }]);
      createdCount++;

      // Notification Push
      if (pref?.push_enabled ?? true) {
        await supabase.from("notifications").insert([{ ...notifBase, channel: "push" }]);
      }

      // Notification Email
      if (pref?.email_enabled) {
        await supabase.from("notifications").insert([{ ...notifBase, channel: "email" }]);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notifications d'information épinglée envoyées à ${createdCount} membre(s).`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Erreur notify-pinned-info:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

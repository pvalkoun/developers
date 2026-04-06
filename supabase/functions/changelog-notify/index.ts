import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChangelogEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
  links?: { label: string; url: string }[];
}

function buildEmailHtml(entry: ChangelogEntry, siteUrl: string): string {
  const tagsHtml = entry.tags
    .map(tag => `<span style="display:inline-block;background:#e2e8f0;color:#475569;padding:2px 8px;border-radius:4px;font-size:12px;margin-right:4px;">${tag}</span>`)
    .join("");

  const linksHtml = entry.links?.length
    ? `<div style="margin-top:16px;">${entry.links.map(l => `<a href="${siteUrl}${l.url}" style="color:#0066cc;text-decoration:none;font-size:14px;margin-right:16px;">${l.label} →</a>`).join("")}</div>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:8px;border-left:4px solid #0066cc;padding:32px;margin-top:16px;">
      <div style="margin-bottom:16px;">
        <img src="https://www.transunion.com/favicon.ico" alt="TransUnion" width="32" height="32" style="vertical-align:middle;margin-right:8px;">
        <span style="font-size:18px;font-weight:bold;color:#1e293b;">TruContact Solutions</span>
      </div>
      <p style="color:#64748b;font-size:14px;margin:0 0 24px;">New update to the TruContact Solutions API platform</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 24px;">
      <div style="margin-bottom:8px;">
        <span style="font-size:13px;font-family:monospace;color:#64748b;">${entry.date}</span>
        &nbsp;${tagsHtml}
      </div>
      <h2 style="font-size:20px;color:#1e293b;margin:8px 0 12px;">${entry.title}</h2>
      <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 16px;">${entry.description}</p>
      ${linksHtml}
    </div>
    <div style="text-align:center;padding:24px 0;color:#94a3b8;font-size:12px;">
      <p>You're receiving this because you subscribed to TruContact Solutions changelog updates.</p>
      <p><a href="${siteUrl}/changelog" style="color:#0066cc;text-decoration:none;">View full changelog</a></p>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Basic auth check - use a secret key to trigger notifications
    const authHeader = req.headers.get("authorization");
    const notifySecret = Deno.env.get("CHANGELOG_NOTIFY_SECRET");
    
    if (!notifySecret || authHeader !== `Bearer ${notifySecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { entry, siteUrl = "https://aadfdsfjjldjf-dev-nectar-pulse.lovable.app" } = await req.json() as { 
      entry: ChangelogEntry; 
      siteUrl?: string;
    };

    if (!entry || !entry.title || !entry.description) {
      return new Response(JSON.stringify({ error: "Changelog entry with title and description is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all verified subscribers
    const { data: subscribers, error } = await supabase
      .from("changelog_subscribers")
      .select("email, name")
      .eq("verified", true);

    if (error) {
      console.error("Failed to fetch subscribers:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch subscribers" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subscribers?.length) {
      return new Response(JSON.stringify({ message: "No verified subscribers to notify", sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailHtml = buildEmailHtml(entry, siteUrl);
    const subject = `TruContact Update: ${entry.title}`;
    
    // Enqueue email for each subscriber
    let enqueued = 0;
    for (const sub of subscribers) {
      // Get or create unsubscribe token
      let unsubscribeToken: string;
      const { data: existingToken } = await supabase
        .from("email_unsubscribe_tokens")
        .select("token")
        .eq("email", sub.email)
        .is("used_at", null)
        .maybeSingle();

      if (existingToken) {
        unsubscribeToken = existingToken.token;
      } else {
        unsubscribeToken = crypto.randomUUID();
        await supabase.from("email_unsubscribe_tokens").insert({
          token: unsubscribeToken,
          email: sub.email,
        });
      }

      const messageId = crypto.randomUUID();
      const idempotencyKey = `changelog-notify-${entry.date}-${entry.title.slice(0, 30)}-${sub.email}`;
      const emailText = `${entry.title}\n\n${entry.description}\n\nView full changelog: ${siteUrl}/changelog`;
      const { error: enqueueError } = await supabase.rpc("enqueue_email", {
        queue_name: "transactional_emails",
        payload: {
          message_id: messageId,
          idempotency_key: idempotencyKey,
          purpose: "transactional",
          to: sub.email,
          subject,
          html: emailHtml,
          text: emailText,
          from: "TruContact Solutions <noreply@notify.mountainaiproject.com>",
          sender_domain: "notify.mountainaiproject.com",
          label: "changelog-notification",
          unsubscribe_token: unsubscribeToken,
        },
      });

      if (enqueueError) {
        console.error(`Failed to enqueue email for ${sub.email}:`, enqueueError);
        continue;
      }

      await supabase.from("email_send_log").insert({
        message_id: messageId,
        recipient_email: sub.email,
        template_name: "changelog-notification",
        status: "pending",
      });

      enqueued++;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification queued for ${enqueued} subscriber(s)`,
        sent: enqueued,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Notify error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

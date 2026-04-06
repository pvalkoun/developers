import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
  "icloud.com", "mail.com", "protonmail.com", "zoho.com", "yandex.com",
  "gmx.com", "live.com", "msn.com", "me.com", "fastmail.com",
  "tutanota.com", "inbox.com", "qq.com", "163.com", "126.com",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { first_name, last_name, email, company_name } = await req.json();

    if (!first_name || typeof first_name !== "string" || first_name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "First name is required (min 2 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!last_name || typeof last_name !== "string" || last_name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Last name is required (min 2 characters)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!company_name || typeof company_name !== "string" || company_name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Company name is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailLower = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = emailLower.split("@")[1];
    if (FREE_EMAIL_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({ error: "Please use a work email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("changelog_subscribers")
      .select("id, verified")
      .eq("email", emailLower)
      .maybeSingle();

    if (existing?.verified) {
      return new Response(JSON.stringify({ error: "This email is already subscribed" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let verificationToken: string;

    if (existing && !existing.verified) {
      // Re-send verification - generate new token
      const newToken = crypto.randomUUID();
      await supabase
        .from("changelog_subscribers")
        .update({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          company_name: company_name.trim(),
          verification_token: newToken,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      verificationToken = newToken;
    } else {
      // New subscriber
      const newToken = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("changelog_subscribers")
        .insert({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: emailLower,
          company_name: company_name.trim(),
          verification_token: newToken,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to subscribe. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      verificationToken = newToken;
    }

    // Build verification email HTML
    const verifyUrl = `https://www.mountainaiproject.com/changelog/verify?token=${verificationToken}`;
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:8px;border-left:4px solid #0066cc;padding:32px;margin-top:16px;">
      <div style="margin-bottom:16px;">
        <span style="font-size:18px;font-weight:bold;color:#1e293b;">TruContact Solutions</span>
      </div>
      <h2 style="font-size:20px;color:#1e293b;margin:8px 0 12px;">Verify your email</h2>
      <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
        Hi ${first_name.trim()}, thanks for subscribing to TruContact Solutions changelog updates.
        Please verify your email to start receiving notifications about new API changes, features, and updates.
      </p>
      <a href="${verifyUrl}" style="display:inline-block;background:#0066cc;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
        Verify Email
      </a>
      <p style="font-size:12px;color:#94a3b8;margin:24px 0 0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>
</html>`;

    const emailText = `Hi ${first_name.trim()}, thanks for subscribing to TruContact Solutions changelog updates. Please verify your email by visiting: ${verifyUrl}`;

    // Get or create unsubscribe token for this email
    let unsubscribeToken: string;
    const { data: existingToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", emailLower)
      .is("used_at", null)
      .maybeSingle();

    if (existingToken) {
      unsubscribeToken = existingToken.token;
    } else {
      unsubscribeToken = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({
        token: unsubscribeToken,
        email: emailLower,
      });
    }

    // Enqueue verification email
    const messageId = crypto.randomUUID();
    const idempotencyKey = `changelog-verify-${emailLower}-${verificationToken}`;
    const { error: enqueueError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        message_id: messageId,
        idempotency_key: idempotencyKey,
        purpose: "transactional",
        to: emailLower,
        subject: "Verify your TruContact Solutions changelog subscription",
        html: emailHtml,
        text: emailText,
        from: "TruContact Solutions <noreply@notify.mountainaiproject.com>",
        sender_domain: "notify.mountainaiproject.com",
        label: "changelog-verification",
        unsubscribe_token: unsubscribeToken,
      },
    });

    if (enqueueError) {
      console.error("Failed to enqueue verification email:", enqueueError);
    }

    // Log to email_send_log
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      recipient_email: emailLower,
      template_name: "changelog-verification",
      status: "pending",
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Please check your email to verify your subscription.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

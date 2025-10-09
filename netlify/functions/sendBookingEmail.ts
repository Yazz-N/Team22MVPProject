import type { Handler } from "@netlify/functions";

const RESEND_API = process.env.VITE_EMAIL_API_KEY || process.env.EMAIL_API_KEY;
const FROM = process.env.VITE_EMAIL_FROM || "OpsCentral <no-reply@opscentral.example>";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const { email, name, startIso, timezone } = body;
    
    if (!RESEND_API) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ ok: true, note: "Email provider not configured" }) 
      };
    }
    
    const pretty = new Date(startIso).toLocaleString("en-GB", { 
      timeZone: timezone, 
      hour12: false 
    });
    
    const subject = "Your OpsCentral demo is booked";
    const html = `<p>Hello ${name},</p><p>Your demo is booked for <strong>${pretty}</strong> (${timezone}).</p><p>Please add the attached calendar invite.</p><p>— The OpsCentral Team</p>`;
    
    // Simple email via Resend
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${RESEND_API}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        from: FROM, 
        to: email, 
        subject, 
        html 
      })
    });
    
    const data = await resp.json();
    return { 
      statusCode: 200, 
      body: JSON.stringify({ ok: true, data }) 
    };
  } catch (e: any) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ ok: false, error: e?.message || "error" }) 
    };
  }
};

// TODO: Future scheduled invocation (Netlify Scheduled Functions or Supabase cron) 
// to send T-1 day reminder emails
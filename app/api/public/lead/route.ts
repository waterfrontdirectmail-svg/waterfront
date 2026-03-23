import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, serviceType, area, message } = body;

    if (!name || !company || !email || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to save to Supabase (non-blocking - if table doesn't exist, that's ok)
    try {
      const { supabaseAdmin } = await import("@/lib/supabase-server");
      await supabaseAdmin
        .from("leads")
        .insert({
          name,
          company,
          email,
          phone: phone || null,
          service_type: serviceType,
          service_area: area || null,
          message: message || null,
          source: "website_form",
        });
    } catch (dbErr) {
      console.warn("DB insert skipped:", dbErr);
    }

    // Send emails via Google Workspace SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Notification to sales team
      await transporter.sendMail({
        from: `"Waterfront Direct Mail" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Lead: ${company} - ${name}`,
        html: `
          <h2>New Campaign Inquiry</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${company}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || "Not provided"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Service Type</td><td style="padding:8px;">${serviceType}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Service Area</td><td style="padding:8px;">${area || "Not specified"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${message || "None"}</td></tr>
          </table>
        `,
      });

      // Auto-reply to customer
      await transporter.sendMail({
        from: `"Waterfront Direct Mail" <${process.env.SMTP_USER}>`,
        replyTo: process.env.SMTP_USER,
        to: email,
        subject: "We received your campaign inquiry!",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#1B2A4A;padding:24px 32px;border-radius:8px 8px 0 0;">
              <h1 style="color:#C9A84C;margin:0;font-size:22px;">Waterfront Direct Mail</h1>
            </div>
            <div style="padding:32px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 8px 8px;">
              <p style="font-size:16px;color:#333;">Hi ${name.split(" ")[0]},</p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                Thanks for your interest in Waterfront Direct Mail! We received your inquiry and will put together a free campaign plan for <strong>${company}</strong> within one business day.
              </p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                Your plan will include the number of verified waterfront homeowners in your service area and recommended campaign options.
              </p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                In the meantime, feel free to explore our coverage at <a href="https://waterfrontdirectmail.com/explore" style="color:#1B2A4A;font-weight:600;">waterfrontdirectmail.com/explore</a>.
              </p>
              <p style="font-size:15px;color:#555;margin-top:24px;">
                Talk soon,<br>
                <strong>The Waterfront Direct Mail Team</strong><br>
                <span style="color:#888;">(561) 247-8632 | sales@waterfrontdirectmail.com</span>
              </p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

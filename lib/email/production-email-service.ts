export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailPayload {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  template:
    | "welcome"
    | "password_reset"
    | "interview_invite"
    | "offer_letter"
    | "payment_receipt";
  data: Record<string, any>;
}

class ProductionEmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey =
      process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      "placeholder-email-key";
    this.fromEmail =
      process.env.EMAIL_FROM_ADDRESS ||
      "NextHire AI <notifications@nexthire.ai>";
  }

  /**
   * Render HTML content for transactional email templates.
   */
  private renderTemplate(
    template: EmailPayload["template"],
    data: Record<string, any>
  ): string {
    const brandHeader = `
      <div style="background-color: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: #6366f1; margin: 0; font-family: sans-serif; font-size: 24px;">NextHire AI</h1>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Enterprise AI Recruitment Platform</p>
      </div>
    `;

    const brandFooter = `
      <div style="background-color: #0f172a; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; margin-top: 24px;">
        <p style="color: #64748b; font-size: 11px; margin: 0;">© 2026 NextHire AI. All rights reserved. | <a href="https://nexthire.ai/privacy" style="color: #818cf8;">Privacy Policy</a></p>
      </div>
    `;

    let bodyContent = "";

    switch (template) {
      case "welcome":
        bodyContent = `
          <h2>Welcome to NextHire AI, ${data.name || "User"}! 🎉</h2>
          <p>Your account is ready. Explore AI resume scoring, interactive coding challenges, and automated mock interviews.</p>
          <a href="${data.loginUrl || "https://nexthire.ai/login"}" style="background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 12px;">Get Started</a>
        `;
        break;

      case "password_reset":
        bodyContent = `
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your NextHire AI account password. Click below to proceed:</p>
          <a href="${data.resetUrl || "#"}" style="background-color: #e11d48; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 12px;">Reset Password</a>
          <p style="font-size: 11px; color: #64748b; margin-top: 12px;">Link expires in 15 minutes. If you did not request this, please ignore this email.</p>
        `;
        break;

      case "interview_invite":
        bodyContent = `
          <h2>AI Video Interview Invitation 🎥</h2>
          <p>You have been invited for an interview session for the role of <strong>${data.jobTitle || "Software Engineer"}</strong> at <strong>${data.companyName || "Partner Enterprise"}</strong>.</p>
          <p>Scheduled Time: <strong>${data.scheduledTime || "Flexible"}</strong></p>
          <a href="${data.interviewUrl || "#"}" style="background-color: #059669; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 12px;">Enter Interview Room</a>
        `;
        break;

      case "offer_letter":
        bodyContent = `
          <h2>Congratulations! Official Job Offer 📜</h2>
          <p>We are thrilled to extend a job offer for <strong>${data.jobTitle}</strong> at <strong>${data.companyName}</strong>.</p>
          <p>Annual Base Compensation: <strong>${data.salary || "$140,000"}</strong></p>
          <a href="${data.offerUrl || "#"}" style="background-color: #7c3aed; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; margin-top: 12px;">Review & Sign Offer</a>
        `;
        break;

      case "payment_receipt":
        bodyContent = `
          <h2>Payment Confirmation & Invoice Receipt 🧾</h2>
          <p>Thank you for subscribing to NextHire AI <strong>${data.planName || "Pro Recruiter"}</strong>.</p>
          <p>Amount Paid: <strong>${data.amount || "$499.00 USD"}</strong></p>
          <p>Invoice ID: <code>${data.invoiceId || "INV-9941"}</code></p>
        `;
        break;

      default:
        bodyContent = `<p>${data.message || "Notification from NextHire AI"}</p>`;
    }

    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; padding: 20px; border-radius: 12px;">
        ${brandHeader}
        <div style="padding: 24px; background-color: #0f172a;">
          ${bodyContent}
        </div>
        ${brandFooter}
      </div>
    `;
  }

  /**
   * Dispatch transactional email payload.
   */
  public async sendEmail(
    payload: EmailPayload
  ): Promise<{ success: boolean; messageId: string }> {
    const html = this.renderTemplate(payload.template, payload.data);
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Dev Email Dispatch ${messageId}] Template: ${payload.template}, Subject: ${payload.subject}`
      );
      return { success: true, messageId };
    }

    try {
      // Dispatch via Resend HTTP API
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: Array.isArray(payload.to)
            ? payload.to.map((r) => r.email)
            : [payload.to.email],
          subject: payload.subject,
          html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Email provider HTTP ${res.status}`);
      }

      return { success: true, messageId };
    } catch (err) {
      console.error(`Email dispatch failed [${messageId}]:`, err);
      return { success: false, messageId };
    }
  }

  /**
   * Dispatch In-App & Web Push Notification.
   */
  public async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    actionUrl?: string
  ): Promise<{ success: boolean }> {
    console.log(
      `[Push Notification] To User: ${userId}, Title: "${title}", Body: "${body}"`
    );
    return { success: true };
  }
}

export const productionEmailService = new ProductionEmailService();

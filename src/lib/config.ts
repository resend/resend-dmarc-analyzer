/**
 * Environment configuration
 */
export const config = {
  // Resend API key for sending emails
  resendApiKey: process.env.RESEND_API_KEY || '',

  // Webhook signing secret for verifying incoming webhooks
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',

  // Email address to send DMARC report digests to
  recipientEmail: process.env.DMARC_RECIPIENT_EMAIL || '',

  // Domain to send emails from (e.g., "reports.example.com")
  sendingDomain: process.env.DMARC_SENDING_DOMAIN || '',

  // Sender email (constructed from sending domain)
  get senderEmail() {
    return this.sendingDomain
      ? `dmarc@${this.sendingDomain}`
      : 'dmarc@example.com';
  },
};

/**
 * Validate required configuration for webhook processing
 */
export function validateWebhookConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!config.webhookSecret) {
    missing.push('RESEND_WEBHOOK_SECRET');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Validate required configuration for sending emails
 */
export function validateEmailConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!config.resendApiKey) {
    missing.push('RESEND_API_KEY');
  }
  if (!config.recipientEmail) {
    missing.push('DMARC_RECIPIENT_EMAIL');
  }
  if (!config.sendingDomain) {
    missing.push('DMARC_SENDING_DOMAIN');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

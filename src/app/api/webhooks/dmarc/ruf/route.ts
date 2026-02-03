import { type NextRequest, NextResponse } from 'next/server';
import { config, validateWebhookConfig } from '@/lib/config';
import {
  extractWebhookHeaders,
  verifyWebhookSignature,
} from '@/lib/webhook/verify';
import type { RUFReport } from '@/types/dmarc';

interface ResendInboundEmail {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    content_type: string;
  }>;
}

export async function POST(request: NextRequest) {
  // Validate config
  const configValidation = validateWebhookConfig();
  if (!configValidation.valid) {
    console.error('Missing configuration:', configValidation.missing);
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  // Get raw body for signature verification
  const rawBody = await request.text();

  // Verify webhook signature
  const webhookHeaders = extractWebhookHeaders(request.headers);
  if (!webhookHeaders) {
    return NextResponse.json(
      { error: 'Missing webhook signature headers' },
      { status: 401 },
    );
  }

  const isValid = verifyWebhookSignature(
    rawBody,
    webhookHeaders,
    config.webhookSecret,
  );

  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 401 },
    );
  }

  // Parse the email payload
  let email: ResendInboundEmail;
  try {
    email = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  // Create RUF report object - pass through raw content
  const rufReport: RUFReport = {
    raw: email.text || email.html || '',
    receivedAt: new Date(),
    from: email.from,
    subject: email.subject,
  };

  // TODO: Store in database when ready
  // TODO: Send notification email for forensic reports

  console.log(`Received RUF (forensic) report from ${email.from}`);
  console.log('Subject:', email.subject);

  return NextResponse.json({
    success: true,
    type: 'ruf',
    from: rufReport.from,
    subject: rufReport.subject,
    receivedAt: rufReport.receivedAt.toISOString(),
  });
}

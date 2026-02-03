/**
 * Test script to send a DMARC report email with sample data
 *
 * Usage:
 *   pnpm test:email <recipient-email>
 *
 * Requires RESEND_API_KEY and DMARC_SENDING_DOMAIN env vars
 */

import { existsSync } from 'node:fs';
import { config } from 'dotenv';
import { Resend } from 'resend';
import { DMARCReportEmail } from '../src/emails/dmarc-report';
import type { DMARCAnalysis } from '../src/types/dmarc';

// Load .env first, then .env.local as fallback
if (existsSync('.env')) {
  config({ path: '.env' });
} else if (existsSync('.env.local')) {
  config({ path: '.env.local' });
}

const sampleAnalysis: DMARCAnalysis = {
  report: {
    report_metadata: {
      org_name: 'Google Inc.',
      email: 'noreply-dmarc-support@google.com',
      extra_contact_info: 'https://support.google.com/a/answer/2466580',
      report_id: '12345678901234567890',
      date_range: {
        begin: 1706745600,
        end: 1706832000,
      },
    },
    policy_published: {
      domain: 'example.com',
      adkim: 'r',
      aspf: 'r',
      p: 'reject',
      sp: 'reject',
      pct: 100,
    },
    record: [
      {
        row: {
          source_ip: '209.85.220.41',
          count: 1523,
          policy_evaluated: {
            disposition: 'none',
            dkim: 'pass',
            spf: 'pass',
          },
        },
        identifiers: {
          header_from: 'example.com',
        },
        auth_results: {
          dkim: [
            {
              domain: 'example.com',
              selector: 'google',
              result: 'pass',
            },
          ],
          spf: [
            {
              domain: 'example.com',
              result: 'pass',
            },
          ],
        },
      },
      {
        row: {
          source_ip: '198.51.100.42',
          count: 87,
          policy_evaluated: {
            disposition: 'none',
            dkim: 'pass',
            spf: 'pass',
          },
        },
        identifiers: {
          header_from: 'example.com',
        },
        auth_results: {
          dkim: [
            {
              domain: 'example.com',
              selector: 'resend',
              result: 'pass',
            },
          ],
          spf: [
            {
              domain: 'example.com',
              result: 'pass',
            },
          ],
        },
      },
      {
        row: {
          source_ip: '203.0.113.99',
          count: 42,
          policy_evaluated: {
            disposition: 'reject',
            dkim: 'fail',
            spf: 'fail',
          },
        },
        identifiers: {
          header_from: 'example.com',
        },
        auth_results: {
          dkim: [
            {
              domain: 'malicious.com',
              result: 'fail',
            },
          ],
          spf: [
            {
              domain: 'malicious.com',
              result: 'fail',
            },
          ],
        },
      },
      {
        row: {
          source_ip: '192.0.2.50',
          count: 15,
          policy_evaluated: {
            disposition: 'quarantine',
            dkim: 'fail',
            spf: 'pass',
            reason: [
              {
                type: 'forwarded',
                comment: 'Message was forwarded by known forwarder',
              },
            ],
          },
        },
        identifiers: {
          header_from: 'example.com',
          envelope_to: 'recipient.com',
        },
        auth_results: {
          dkim: [
            {
              domain: 'example.com',
              selector: 'google',
              result: 'fail',
              human_result: 'signature verification failed',
            },
          ],
          spf: [
            {
              domain: 'forwarder.com',
              result: 'pass',
            },
          ],
        },
      },
      {
        row: {
          source_ip: '10.0.0.1',
          count: 5,
          policy_evaluated: {
            disposition: 'none',
            dkim: 'pass',
            spf: 'fail',
            reason: [
              {
                type: 'mailing_list',
              },
            ],
          },
        },
        identifiers: {
          header_from: 'example.com',
        },
        auth_results: {
          dkim: [
            {
              domain: 'example.com',
              selector: 'google',
              result: 'pass',
            },
          ],
          spf: [
            {
              domain: 'mailinglist.com',
              result: 'softfail',
            },
          ],
        },
      },
    ],
  },
  summary: {
    totalMessages: 1672,
    passedDKIM: 1615,
    failedDKIM: 57,
    passedSPF: 1630,
    failedSPF: 42,
    passedBoth: 1610,
    failedBoth: 42,
    dispositionNone: 1615,
    dispositionQuarantine: 15,
    dispositionReject: 42,
  },
  dateRange: {
    start: new Date(1706745600 * 1000),
    end: new Date(1706832000 * 1000),
  },
};

async function main() {
  const recipient = process.argv[2];

  if (!recipient) {
    console.error('Usage: pnpm test:email <recipient-email>');
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sendingDomain = process.env.DMARC_SENDING_DOMAIN;

  if (!apiKey) {
    console.error('Error: RESEND_API_KEY environment variable is required');
    process.exit(1);
  }

  if (!sendingDomain) {
    console.error(
      'Error: DMARC_SENDING_DOMAIN environment variable is required',
    );
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const from = `dmarc@${sendingDomain}`;

  console.log(`Sending test DMARC report email...`);
  console.log(`  From: ${from}`);
  console.log(`  To: ${recipient}`);

  const { data, error } = await resend.emails.send({
    from,
    to: recipient,
    subject: `[TEST] DMARC Report: ${sampleAnalysis.report.report_metadata.org_name} - 96.3% pass rate`,
    react: DMARCReportEmail({ analysis: sampleAnalysis }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    process.exit(1);
  }

  console.log(`Email sent successfully!`);
  console.log(`  Email ID: ${data?.id}`);
}

main();

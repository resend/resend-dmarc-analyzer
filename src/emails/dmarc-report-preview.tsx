import type { DMARCAnalysis } from '@/types/dmarc';
import { DMARCReportEmail } from './dmarc-report';

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
    ],
  },
  summary: {
    totalMessages: 1667,
    passedDKIM: 1610,
    failedDKIM: 57,
    passedSPF: 1625,
    failedSPF: 42,
    passedBoth: 1610,
    failedBoth: 42,
    dispositionNone: 1610,
    dispositionQuarantine: 15,
    dispositionReject: 42,
  },
  dateRange: {
    start: new Date(1706745600 * 1000),
    end: new Date(1706832000 * 1000),
  },
};

export default function DMARCReportPreview() {
  return <DMARCReportEmail analysis={sampleAnalysis} />;
}

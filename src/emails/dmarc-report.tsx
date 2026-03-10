import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { DMARCAnalysis, DMARCRecord } from '@/types/dmarc';

interface DMARCReportEmailProps {
  analysis: DMARCAnalysis;
}

export function DMARCReportEmail({ analysis }: DMARCReportEmailProps) {
  const { report, summary, dateRange } = analysis;
  const passRate =
    summary.totalMessages > 0
      ? ((summary.passedBoth / summary.totalMessages) * 100).toFixed(1)
      : '0';

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Html>
      <Head />
      <Preview>
        DMARC Report from {report.report_metadata.org_name} - {passRate}% pass
        rate
      </Preview>
      <Tailwind>
        <Body className="bg-[#000000] font-sans">
          <Container className="mx-auto py-8 px-4 max-w-[600px]">
            {/* Header */}
            <Section className="mb-8">
              <Heading className="text-[#FDFDFD] text-2xl font-semibold m-0">
                DMARC report analysis
              </Heading>
              <Text className="text-[#6b6b6b] text-sm mt-2 mb-0">
                {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
              </Text>
            </Section>

            {/* Report Metadata Card */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Heading className="text-[#FDFDFD] text-lg font-semibold m-0 mb-1">
                {report.report_metadata.org_name}
              </Heading>
              <Text className="text-[#6b6b6b] text-sm m-0">
                Report ID: {report.report_metadata.report_id}
              </Text>
              <Text className="text-[#454545] text-xs m-0 mt-1">
                {report.report_metadata.email}
              </Text>
            </Section>

            {/* Summary Stats */}
            <Section className="mb-6">
              <Row>
                <Column className="w-1/2 pr-2">
                  <Section className="bg-[#141414] rounded-xl p-4 border border-[#1f1f1f]">
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">
                      Total Messages
                    </Text>
                    <Text className="text-[#FDFDFD] text-2xl font-semibold m-0">
                      {summary.totalMessages.toLocaleString()}
                    </Text>
                  </Section>
                </Column>
                <Column className="w-1/2 pl-2">
                  <Section
                    className={`rounded-xl p-4 border ${
                      Number(passRate) >= 95
                        ? 'bg-[#22FF991E] border-[#46FEA54D]'
                        : Number(passRate) >= 80
                          ? 'bg-[#FA820022] border-[#FFCA164D]'
                          : 'bg-[#FF173F2D] border-[#FF95924D]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">
                      Pass rate
                    </Text>
                    <Text
                      className={`text-2xl font-semibold m-0 ${
                        Number(passRate) >= 95
                          ? 'text-[#46FEA5D4]'
                          : Number(passRate) >= 80
                            ? 'text-[#FFCA16]'
                            : 'text-[#FF9592]'
                      }`}
                    >
                      {passRate}%
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Auth results */}
            <Section className="mb-6">
              <Row>
                <Column className="w-1/2 pr-2">
                  <Section
                    className={`rounded-xl p-4 border ${
                      summary.failedDKIM === 0
                        ? 'bg-[#22FF991E] border-[#46FEA54D]'
                        : 'bg-[#FF173F2D] border-[#FF95924D]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">
                      DKIM
                    </Text>
                    <Text
                      className={`text-xl font-semibold m-0 ${
                        summary.failedDKIM === 0
                          ? 'text-[#46FEA5D4]'
                          : 'text-[#FF9592]'
                      }`}
                    >
                      {summary.passedDKIM.toLocaleString()} passed
                    </Text>
                    <Text className="text-[#6b6b6b] text-xs m-0 mt-1">
                      {summary.failedDKIM.toLocaleString()} failed
                    </Text>
                  </Section>
                </Column>
                <Column className="w-1/2 pl-2">
                  <Section
                    className={`rounded-xl p-4 border ${
                      summary.failedSPF === 0
                        ? 'bg-[#22FF991E] border-[#46FEA54D]'
                        : 'bg-[#FF173F2D] border-[#FF95924D]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">SPF</Text>
                    <Text
                      className={`text-xl font-semibold m-0 ${
                        summary.failedSPF === 0
                          ? 'text-[#46FEA5D4]'
                          : 'text-[#FF9592]'
                      }`}
                    >
                      {summary.passedSPF.toLocaleString()} passed
                    </Text>
                    <Text className="text-[#6b6b6b] text-xs m-0 mt-1">
                      {summary.failedSPF.toLocaleString()} failed
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Policy info */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                Published policy
              </Text>
              <Row className="mb-2">
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">Domain</Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1">
                    {report.policy_published.domain}
                  </Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">Policy</Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1 capitalize">
                    {report.policy_published.p}
                  </Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">Subdomain</Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1 capitalize">
                    {report.policy_published.sp}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">
                    DKIM Alignment
                  </Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1">
                    {report.policy_published.adkim === 'r'
                      ? 'Relaxed'
                      : 'Strict'}
                  </Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">
                    SPF Alignment
                  </Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1">
                    {report.policy_published.aspf === 'r'
                      ? 'Relaxed'
                      : 'Strict'}
                  </Text>
                </Column>
                <Column className="w-1/3">
                  <Text className="text-[#454545] text-xs m-0">Percentage</Text>
                  <Text className="text-[#d4d4d4] text-sm m-0 mt-1">
                    {report.policy_published.pct}%
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Disposition breakdown (if any quarantined/rejected) */}
            {(summary.dispositionQuarantine > 0 ||
              summary.dispositionReject > 0) && (
              <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
                <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                  Disposition breakdown
                </Text>
                <Row>
                  <Column className="w-1/3">
                    <Text className="text-[#454545] text-xs m-0">None</Text>
                    <Text className="text-[#d4d4d4] text-lg m-0 mt-1">
                      {summary.dispositionNone.toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/3">
                    <Text className="text-[#454545] text-xs m-0">
                      Quarantined
                    </Text>
                    <Text className="text-[#FFCA16] text-lg m-0 mt-1">
                      {summary.dispositionQuarantine.toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/3">
                    <Text className="text-[#454545] text-xs m-0">Rejected</Text>
                    <Text className="text-[#FF9592] text-lg m-0 mt-1">
                      {summary.dispositionReject.toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Top records (max 10) */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                Top sources ({Math.min(report.record.length, 10)} of{' '}
                {report.record.length})
              </Text>
              {report.record.slice(0, 10).map((record, index) => (
                <RecordRow
                  key={index}
                  record={record}
                  isLast={index === Math.min(report.record.length, 10) - 1}
                />
              ))}
            </Section>

            <Hr className="border-[#1f1f1f] my-8" />

            {/* Footer */}
            <Section>
              <Text className="text-[#454545] text-xs text-center m-0">
                This report was generated by{' '}
                <Link
                  href="https://github.com/resend/resend-dmarc-analyzer"
                  className="text-[#6b6b6b]"
                >
                  DMARC Analyzer
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

function RecordRow({
  record,
  isLast,
}: {
  record: DMARCRecord;
  isLast: boolean;
}) {
  const dkimPass = record.row.policy_evaluated?.dkim === 'pass';
  const spfPass = record.row.policy_evaluated?.spf === 'pass';

  return (
    <Section className={`py-3 ${!isLast ? 'border-b border-[#1f1f1f]' : ''}`}>
      <Row>
        <Column className="w-2/5">
          <Text className="text-[#d4d4d4] text-sm m-0 font-mono">
            {record.row.source_ip}
          </Text>
          <Text className="text-[#454545] text-xs m-0 mt-1">
            {record.identifiers.header_from}
          </Text>
        </Column>
        <Column className="w-1/5 text-right">
          <Text className="text-[#b4b4b4] text-sm m-0">
            {record.row.count.toLocaleString()}
          </Text>
        </Column>
        <Column className="w-1/5 text-center">
          <Text
            className={`text-xs m-0 ${dkimPass ? 'text-[#46FEA5D4]' : 'text-[#FF9592]'}`}
          >
            DKIM {dkimPass ? '✓' : '✗'}
          </Text>
        </Column>
        <Column className="w-1/5 text-center">
          <Text
            className={`text-xs m-0 ${spfPass ? 'text-[#46FEA5D4]' : 'text-[#FF9592]'}`}
          >
            SPF {spfPass ? '✓' : '✗'}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

DMARCReportEmail.PreviewProps = {
  analysis: {
    report: {
      report_metadata: {
        org_name: 'Google Inc.',
        email: 'noreply-dmarc-support@google.com',
        extra_contact_info: 'https://support.google.com/a/answer/2466580',
        report_id: '12345678901234567890',
        date_range: { begin: 1706745600, end: 1706832000 },
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
          identifiers: { header_from: 'example.com' },
          auth_results: {
            dkim: [
              { domain: 'example.com', selector: 'google', result: 'pass' },
            ],
            spf: [{ domain: 'example.com', result: 'pass' }],
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
          identifiers: { header_from: 'example.com' },
          auth_results: {
            dkim: [
              { domain: 'example.com', selector: 'resend', result: 'pass' },
            ],
            spf: [{ domain: 'example.com', result: 'pass' }],
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
          identifiers: { header_from: 'example.com' },
          auth_results: {
            dkim: [{ domain: 'malicious.com', result: 'fail' }],
            spf: [{ domain: 'malicious.com', result: 'fail' }],
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
            spf: [{ domain: 'forwarder.com', result: 'pass' }],
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
              reason: [{ type: 'mailing_list' }],
            },
          },
          identifiers: { header_from: 'example.com' },
          auth_results: {
            dkim: [
              { domain: 'example.com', selector: 'google', result: 'pass' },
            ],
            spf: [{ domain: 'mailinglist.com', result: 'softfail' }],
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
  },
} satisfies DMARCReportEmailProps;

export default DMARCReportEmail;

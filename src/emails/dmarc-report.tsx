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
              <Heading className="text-[#ededed] text-2xl font-semibold m-0">
                DMARC Report Analysis
              </Heading>
              <Text className="text-[#6b6b6b] text-sm mt-2 mb-0">
                {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
              </Text>
            </Section>

            {/* Report Metadata Card */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Heading className="text-[#ededed] text-lg font-semibold m-0 mb-1">
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
                    <Text className="text-[#ededed] text-2xl font-semibold m-0">
                      {summary.totalMessages.toLocaleString()}
                    </Text>
                  </Section>
                </Column>
                <Column className="w-1/2 pl-2">
                  <Section
                    className={`rounded-xl p-4 border ${
                      Number(passRate) >= 95
                        ? 'bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.3)]'
                        : Number(passRate) >= 80
                          ? 'bg-[rgba(234,179,8,0.15)] border-[rgba(234,179,8,0.3)]'
                          : 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">
                      Pass Rate
                    </Text>
                    <Text
                      className={`text-2xl font-semibold m-0 ${
                        Number(passRate) >= 95
                          ? 'text-[#22c55e]'
                          : Number(passRate) >= 80
                            ? 'text-[#eab308]'
                            : 'text-[#ef4444]'
                      }`}
                    >
                      {passRate}%
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Auth Results */}
            <Section className="mb-6">
              <Row>
                <Column className="w-1/2 pr-2">
                  <Section
                    className={`rounded-xl p-4 border ${
                      summary.failedDKIM === 0
                        ? 'bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.3)]'
                        : 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">
                      DKIM
                    </Text>
                    <Text
                      className={`text-xl font-semibold m-0 ${
                        summary.failedDKIM === 0
                          ? 'text-[#22c55e]'
                          : 'text-[#ef4444]'
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
                        ? 'bg-[rgba(34,197,94,0.15)] border-[rgba(34,197,94,0.3)]'
                        : 'bg-[rgba(239,68,68,0.15)] border-[rgba(239,68,68,0.3)]'
                    }`}
                  >
                    <Text className="text-[#6b6b6b] text-xs m-0 mb-1">SPF</Text>
                    <Text
                      className={`text-xl font-semibold m-0 ${
                        summary.failedSPF === 0
                          ? 'text-[#22c55e]'
                          : 'text-[#ef4444]'
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

            {/* Policy Info */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                Published Policy
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

            {/* Disposition Breakdown (if any quarantined/rejected) */}
            {(summary.dispositionQuarantine > 0 ||
              summary.dispositionReject > 0) && (
              <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
                <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                  Disposition Breakdown
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
                    <Text className="text-[#eab308] text-lg m-0 mt-1">
                      {summary.dispositionQuarantine.toLocaleString()}
                    </Text>
                  </Column>
                  <Column className="w-1/3">
                    <Text className="text-[#454545] text-xs m-0">Rejected</Text>
                    <Text className="text-[#ef4444] text-lg m-0 mt-1">
                      {summary.dispositionReject.toLocaleString()}
                    </Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Top Records (max 10) */}
            <Section className="bg-[#141414] rounded-xl p-6 mb-6 border border-[#1f1f1f]">
              <Text className="text-[#6b6b6b] text-xs m-0 mb-3 uppercase tracking-wide">
                Top Sources ({Math.min(report.record.length, 10)} of{' '}
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
                <Link href="https://resend.com" className="text-[#6b6b6b]">
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
            className={`text-xs m-0 ${dkimPass ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}
          >
            DKIM {dkimPass ? '✓' : '✗'}
          </Text>
        </Column>
        <Column className="w-1/5 text-center">
          <Text
            className={`text-xs m-0 ${spfPass ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}
          >
            SPF {spfPass ? '✓' : '✗'}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

export default DMARCReportEmail;

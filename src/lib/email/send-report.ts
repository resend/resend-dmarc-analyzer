import { Resend } from 'resend';
import { DMARCReportEmail } from '@/emails/dmarc-report';
import { config, validateEmailConfig } from '@/lib/config';
import type { DMARCAnalysis } from '@/types/dmarc';

export async function sendDMARCReportEmail(
  analysis: DMARCAnalysis,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const configValidation = validateEmailConfig();
  if (!configValidation.valid) {
    return {
      success: false,
      error: `Missing configuration: ${configValidation.missing.join(', ')}`,
    };
  }

  const resend = new Resend(config.resendApiKey);
  const { report, summary } = analysis;

  const passRate =
    summary.totalMessages > 0
      ? ((summary.passedBoth / summary.totalMessages) * 100).toFixed(1)
      : '0';

  try {
    const { data, error } = await resend.emails.send({
      from: config.senderEmail,
      to: config.recipientEmail,
      subject: `DMARC Report: ${report.report_metadata.org_name} - ${passRate}% pass rate`,
      react: DMARCReportEmail({ analysis }),
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

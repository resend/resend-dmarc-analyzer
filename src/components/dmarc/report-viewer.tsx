'use client';

import type { DMARCAnalysis } from '@/types/dmarc';
import { RecordsTable } from './records-table';
import { SummaryCard } from './summary-card';

interface ReportViewerProps {
  analysis: DMARCAnalysis;
}

export function ReportViewer({ analysis }: ReportViewerProps) {
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
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="border border-gray-3 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-10">
              {report.report_metadata.org_name}
            </h2>
            <p className="text-sm text-gray-6 mt-1">
              Report ID: {report.report_metadata.report_id}
            </p>
          </div>
          <div className="text-sm text-gray-6">
            <p>
              {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
            </p>
            <p className="text-xs mt-1">{report.report_metadata.email}</p>
          </div>
        </div>
      </div>

      {/* Policy Info */}
      <div className="border border-gray-3 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-6 mb-4">
          Published Policy
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-gray-5">Domain</p>
            <p className="font-medium text-gray-9">
              {report.policy_published.domain}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-5">Policy (p)</p>
            <p className="font-medium text-gray-9 capitalize">
              {report.policy_published.p}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-5">Subdomain (sp)</p>
            <p className="font-medium text-gray-9 capitalize">
              {report.policy_published.sp}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-5">DKIM Alignment</p>
            <p className="font-medium text-gray-9">
              {report.policy_published.adkim === 'r' ? 'Relaxed' : 'Strict'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-5">SPF Alignment</p>
            <p className="font-medium text-gray-9">
              {report.policy_published.aspf === 'r' ? 'Relaxed' : 'Strict'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-5">Percentage</p>
            <p className="font-medium text-gray-9">
              {report.policy_published.pct}%
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Messages"
          value={summary.totalMessages.toLocaleString()}
          subtitle={`${report.record.length} source${report.record.length !== 1 ? 's' : ''}`}
        />
        <SummaryCard
          title="Pass Rate"
          value={`${passRate}%`}
          subtitle={`${summary.passedBoth.toLocaleString()} passed both`}
          variant={
            Number(passRate) >= 95
              ? 'success'
              : Number(passRate) >= 80
                ? 'warning'
                : 'danger'
          }
        />
        <SummaryCard
          title="DKIM"
          value={`${summary.passedDKIM.toLocaleString()}`}
          subtitle={`${summary.failedDKIM.toLocaleString()} failed`}
          variant={summary.failedDKIM === 0 ? 'success' : 'danger'}
        />
        <SummaryCard
          title="SPF"
          value={`${summary.passedSPF.toLocaleString()}`}
          subtitle={`${summary.failedSPF.toLocaleString()} failed`}
          variant={summary.failedSPF === 0 ? 'success' : 'danger'}
        />
      </div>

      {/* Disposition Breakdown */}
      {(summary.dispositionQuarantine > 0 || summary.dispositionReject > 0) && (
        <div className="border border-gray-3 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-6 mb-4">
            Disposition Breakdown
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-5">None</p>
              <p className="text-lg font-medium text-gray-9">
                {summary.dispositionNone.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-5">Quarantined</p>
              <p className="text-lg font-medium text-yellow">
                {summary.dispositionQuarantine.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-5">Rejected</p>
              <p className="text-lg font-medium text-red">
                {summary.dispositionReject.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div>
        <h3 className="text-sm font-medium text-gray-6 mb-4">
          Records ({report.record.length})
        </h3>
        <RecordsTable records={report.record} />
      </div>

      {/* Auth Results Detail */}
      <AuthResultsDetail records={report.record} />
    </div>
  );
}

function AuthResultsDetail({
  records,
}: {
  records: DMARCAnalysis['report']['record'];
}) {
  // Aggregate DKIM results by domain
  const dkimByDomain = new Map<
    string,
    { pass: number; fail: number; other: number }
  >();
  const spfByDomain = new Map<
    string,
    { pass: number; fail: number; other: number }
  >();

  for (const record of records) {
    const count = record.row.count;

    for (const dkim of record.auth_results.dkim || []) {
      const existing = dkimByDomain.get(dkim.domain) || {
        pass: 0,
        fail: 0,
        other: 0,
      };
      if (dkim.result === 'pass') {
        existing.pass += count;
      } else if (dkim.result === 'fail') {
        existing.fail += count;
      } else {
        existing.other += count;
      }
      dkimByDomain.set(dkim.domain, existing);
    }

    for (const spf of record.auth_results.spf) {
      const existing = spfByDomain.get(spf.domain) || {
        pass: 0,
        fail: 0,
        other: 0,
      };
      if (spf.result === 'pass') {
        existing.pass += count;
      } else if (spf.result === 'fail' || spf.result === 'softfail') {
        existing.fail += count;
      } else {
        existing.other += count;
      }
      spfByDomain.set(spf.domain, existing);
    }
  }

  if (dkimByDomain.size === 0 && spfByDomain.size === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {dkimByDomain.size > 0 && (
        <div className="border border-gray-3 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-6 mb-4">
            DKIM Results by Domain
          </h3>
          <div className="space-y-3">
            {Array.from(dkimByDomain.entries()).map(([domain, stats]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-sm text-gray-8 font-mono">{domain}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-green">{stats.pass} pass</span>
                  {stats.fail > 0 && (
                    <span className="text-red">{stats.fail} fail</span>
                  )}
                  {stats.other > 0 && (
                    <span className="text-gray-6">{stats.other} other</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {spfByDomain.size > 0 && (
        <div className="border border-gray-3 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-6 mb-4">
            SPF Results by Domain
          </h3>
          <div className="space-y-3">
            {Array.from(spfByDomain.entries()).map(([domain, stats]) => (
              <div key={domain} className="flex items-center justify-between">
                <span className="text-sm text-gray-8 font-mono">{domain}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-green">{stats.pass} pass</span>
                  {stats.fail > 0 && (
                    <span className="text-red">{stats.fail} fail</span>
                  )}
                  {stats.other > 0 && (
                    <span className="text-gray-6">{stats.other} other</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

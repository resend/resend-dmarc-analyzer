'use client';

import type { DMARCRecord } from '@/types/dmarc';
import { StatusBadge } from './status-badge';

interface RecordsTableProps {
  records: DMARCRecord[];
}

export function RecordsTable({ records }: RecordsTableProps) {
  return (
    <div className="border border-gray-3 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-2 border-b border-gray-3">
              <th className="text-left px-4 py-3 text-gray-6 font-medium">
                Source IP
              </th>
              <th className="text-right px-4 py-3 text-gray-6 font-medium">
                Count
              </th>
              <th className="text-left px-4 py-3 text-gray-6 font-medium">
                From
              </th>
              <th className="text-center px-4 py-3 text-gray-6 font-medium">
                DKIM
              </th>
              <th className="text-center px-4 py-3 text-gray-6 font-medium">
                SPF
              </th>
              <th className="text-center px-4 py-3 text-gray-6 font-medium">
                Disposition
              </th>
              <th className="text-left px-4 py-3 text-gray-6 font-medium">
                Override
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={`${record.row.source_ip}-${index}`}
                className="border-b border-gray-3 last:border-b-0 hover:bg-gray-2/50"
              >
                <td className="px-4 py-3 font-mono text-gray-9">
                  {record.row.source_ip}
                </td>
                <td className="px-4 py-3 text-right text-gray-9">
                  {record.row.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-gray-7">
                  {record.identifiers.header_from}
                </td>
                <td className="px-4 py-3 text-center">
                  {record.row.policy_evaluated && (
                    <StatusBadge status={record.row.policy_evaluated.dkim} />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {record.row.policy_evaluated && (
                    <StatusBadge status={record.row.policy_evaluated.spf} />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {record.row.policy_evaluated && (
                    <DispositionBadge
                      disposition={record.row.policy_evaluated.disposition}
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-gray-6 text-xs">
                  {record.row.policy_evaluated?.reason?.map((r, i) => (
                    <span key={i} className="block">
                      {r.type}
                      {r.comment && `: ${r.comment}`}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DispositionBadge({
  disposition,
}: {
  disposition: 'none' | 'quarantine' | 'reject';
}) {
  const config = {
    none: { bg: 'bg-gray-3', text: 'text-gray-6', label: 'None' },
    quarantine: {
      bg: 'bg-yellow-dim',
      text: 'text-yellow',
      label: 'Quarantine',
    },
    reject: { bg: 'bg-red-dim', text: 'text-red', label: 'Reject' },
  };

  const { bg, text, label } = config[disposition];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
}

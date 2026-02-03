'use client';

import { useMemo, useState } from 'react';
import type { DMARCRecord } from '@/types/dmarc';
import { StatusBadge } from './status-badge';

type SortColumn =
  | 'source_ip'
  | 'count'
  | 'from'
  | 'dkim'
  | 'spf'
  | 'disposition'
  | 'override';
type SortDirection = 'asc' | 'desc';

interface RecordsTableProps {
  records: DMARCRecord[];
}

export function RecordsTable({ records }: RecordsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'source_ip':
          comparison = a.row.source_ip.localeCompare(b.row.source_ip);
          break;
        case 'count':
          comparison = a.row.count - b.row.count;
          break;
        case 'from':
          comparison = a.identifiers.header_from.localeCompare(
            b.identifiers.header_from,
          );
          break;
        case 'dkim': {
          const aDkim = String(a.row.policy_evaluated?.dkim ?? '');
          const bDkim = String(b.row.policy_evaluated?.dkim ?? '');
          comparison = aDkim.localeCompare(bDkim);
          break;
        }
        case 'spf': {
          const aSpf = String(a.row.policy_evaluated?.spf ?? '');
          const bSpf = String(b.row.policy_evaluated?.spf ?? '');
          comparison = aSpf.localeCompare(bSpf);
          break;
        }
        case 'disposition': {
          const aDisp = String(a.row.policy_evaluated?.disposition ?? '');
          const bDisp = String(b.row.policy_evaluated?.disposition ?? '');
          comparison = aDisp.localeCompare(bDisp);
          break;
        }
        case 'override': {
          const aOverride = String(
            a.row.policy_evaluated?.reason?.[0]?.type ?? '',
          );
          const bOverride = String(
            b.row.policy_evaluated?.reason?.[0]?.type ?? '',
          );
          comparison = aOverride.localeCompare(bOverride);
          break;
        }
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [records, sortColumn, sortDirection]);

  return (
    <div className="border border-gray-3 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-2 border-b border-gray-3">
              <SortableHeader
                label="Source IP"
                column="source_ip"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="left"
              />
              <SortableHeader
                label="Count"
                column="count"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="right"
              />
              <SortableHeader
                label="From"
                column="from"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="left"
              />
              <SortableHeader
                label="DKIM"
                column="dkim"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="center"
              />
              <SortableHeader
                label="SPF"
                column="spf"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="center"
              />
              <SortableHeader
                label="Disposition"
                column="disposition"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="center"
              />
              <SortableHeader
                label="Override"
                column="override"
                currentColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                align="left"
              />
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record, index) => (
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

function SortableHeader({
  label,
  column,
  currentColumn,
  direction,
  onSort,
  align,
}: {
  label: string;
  column: SortColumn;
  currentColumn: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
  align: 'left' | 'center' | 'right';
}) {
  const isActive = currentColumn === column;
  const alignClass =
    align === 'left'
      ? 'text-left'
      : align === 'right'
        ? 'text-right'
        : 'text-center';

  const justifyClass =
    align === 'left'
      ? 'justify-start'
      : align === 'right'
        ? 'justify-end'
        : 'justify-center';

  return (
    <th
      className={`${alignClass} px-4 py-3 font-medium cursor-pointer select-none hover:bg-gray-3/50 transition-colors`}
      onClick={() => onSort(column)}
    >
      <span className={`inline-flex items-center gap-1 ${justifyClass}`}>
        <span className={isActive ? 'text-gray-9' : 'text-gray-6'}>
          {label}
        </span>
        <SortIcon isActive={isActive} direction={direction} />
      </span>
    </th>
  );
}

function SortIcon({
  isActive,
  direction,
}: {
  isActive: boolean;
  direction: SortDirection;
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`flex-shrink-0 transition-colors ${isActive ? 'text-gray-9' : 'text-gray-5'}`}
    >
      <path
        d="M6 2L9 5H3L6 2Z"
        fill={isActive && direction === 'asc' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M6 10L3 7H9L6 10Z"
        fill={isActive && direction === 'desc' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
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

'use client';

type Status =
  | 'pass'
  | 'fail'
  | 'none'
  | 'neutral'
  | 'softfail'
  | 'temperror'
  | 'permerror'
  | 'policy';

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusConfig: Record<
    Status,
    { bg: string; text: string; label: string }
  > = {
    pass: { bg: 'bg-green-dim', text: 'text-green', label: 'Pass' },
    fail: { bg: 'bg-red-dim', text: 'text-red', label: 'Fail' },
    none: { bg: 'bg-gray-3', text: 'text-gray-6', label: 'None' },
    neutral: { bg: 'bg-gray-3', text: 'text-gray-6', label: 'Neutral' },
    softfail: { bg: 'bg-yellow-dim', text: 'text-yellow', label: 'Softfail' },
    temperror: {
      bg: 'bg-yellow-dim',
      text: 'text-yellow',
      label: 'Temp Error',
    },
    permerror: { bg: 'bg-red-dim', text: 'text-red', label: 'Perm Error' },
    policy: { bg: 'bg-blue-dim', text: 'text-blue', label: 'Policy' },
  };

  const config = statusConfig[status] || statusConfig.none;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}
    >
      {label || config.label}
    </span>
  );
}

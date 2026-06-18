import type { ApplicationStatus } from '../../types';
import { STATUS_COLORS } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];

  return (
    <span
      style={{
        backgroundColor: `${color}1a`,
        color,
        border: `1px solid ${color}40`,
      }}
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span
        style={{ backgroundColor: color }}
        className="mr-1.5 h-1.5 w-1.5 rounded-full"
      />
      {status}
    </span>
  );
}

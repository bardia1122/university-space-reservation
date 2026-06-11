import { clsx } from 'clsx';

type Variant = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'expired' |
  'open' | 'in_progress' | 'resolved' | 'closed' |
  'under_review' | 'implemented' |
  'active' | 'maintenance' | 'inactive' |
  'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';

const variantMap: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-800',
  expired: 'bg-gray-100 text-gray-500',
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-amber-100 text-amber-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
  under_review: 'bg-blue-100 text-blue-800',
  implemented: 'bg-emerald-100 text-emerald-800',
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-amber-100 text-amber-800',
  inactive: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-amber-100 text-amber-800',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-purple-100 text-purple-800',
};

const labelMap: Record<string, string> = {
  pending: 'در انتظار',
  approved: 'تأیید شده',
  rejected: 'رد شده',
  cancelled: 'لغو شده',
  completed: 'انجام شده',
  expired: 'منقضی شده',
  open: 'باز',
  in_progress: 'در حال بررسی',
  resolved: 'رفع شده',
  closed: 'بسته شده',
  under_review: 'در حال بررسی',
  implemented: 'اجرا شده',
  active: 'فعال',
  maintenance: 'در تعمیر',
  inactive: 'غیرفعال',
};

interface BadgeProps {
  variant: Variant;
  label?: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        variantMap[variant] ?? 'bg-gray-100 text-gray-600',
        className,
      )}
    >
      {label ?? labelMap[variant] ?? variant}
    </span>
  );
}

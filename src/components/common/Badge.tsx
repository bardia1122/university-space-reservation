import { clsx } from 'clsx';

type Variant = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'expired' |
  'open' | 'in_progress' | 'resolved' | 'closed' |
  'under_review' | 'implemented' |
  'active' | 'maintenance' | 'inactive' |
  'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'purple';

const variantMap: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
  expired: 'bg-gray-100 text-gray-500 dark:bg-slate-700/40 dark:text-slate-400',
  open: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300',
  under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
  implemented: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
  active: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
  maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
  yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-400/15 dark:text-purple-300',
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
        variantMap[variant] ?? 'bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300',
        className,
      )}
    >
      {label ?? labelMap[variant] ?? variant}
    </span>
  );
}

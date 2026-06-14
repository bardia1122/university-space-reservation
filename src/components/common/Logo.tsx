import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface LogoProps {
  /** Size of the square mark in pixels */
  size?: number;
  /** Show the Persian wordmark next to the mark */
  withWordmark?: boolean;
  /** Stack the wordmark layout for hero/auth headers */
  variant?: 'horizontal' | 'stacked';
  /** When set, the whole logo becomes a link to this route (e.g. "/" for home). */
  to?: string;
  className?: string;
}

/**
 * Brand mark for «سامانه فضاهای دانشگاه».
 * An abstract academic-hall motif (pediment + columns) inside a gradient tile.
 * Pure SVG — scales crisply and needs no external assets.
 */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const gid = 'logo-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="نشان سامانه فضاهای دانشگاه"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={`url(#${gid})`} />
      {/* pediment roof */}
      <path
        d="M24 11.5 12 19.5h24L24 11.5Z"
        fill="#fff"
        opacity="0.95"
      />
      {/* lintel */}
      <rect x="12" y="20.5" width="24" height="2.6" rx="1.3" fill="#fff" opacity="0.95" />
      {/* columns (symmetric around centre x=24) */}
      <rect x="15.2" y="24.5" width="2.8" height="9" rx="1" fill="#fff" opacity="0.9" />
      <rect x="22.6" y="24.5" width="2.8" height="9" rx="1" fill="#fff" opacity="0.9" />
      <rect x="30" y="24.5" width="2.8" height="9" rx="1" fill="#fff" opacity="0.9" />
      {/* base */}
      <rect x="12" y="34.5" width="24" height="2.8" rx="1.4" fill="#fff" opacity="0.95" />
    </svg>
  );
}

export function Logo({
  size = 40,
  withWordmark = true,
  variant = 'horizontal',
  to,
  className,
}: LogoProps) {
  let content;

  if (!withWordmark) {
    content = <LogoMark size={size} />;
  } else if (variant === 'stacked') {
    content = (
      <div className="flex flex-col items-center gap-3">
        <LogoMark size={size} />
        <div className="text-center leading-tight">
          <p className="font-bold text-gray-900 dark:text-slate-100">سامانه فضاهای دانشگاه</p>
          <p className="text-xs text-gray-400 mt-0.5 dark:text-slate-500">رزرو و مدیریت یکپارچه</p>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex items-center gap-3">
        <LogoMark size={size} />
        <div className="leading-tight">
          <p className="font-bold text-gray-900 text-sm dark:text-slate-100">سامانه فضاهای دانشگاه</p>
          <p className="text-[10px] text-gray-400 dark:text-slate-500">رزرو و مدیریت یکپارچه</p>
        </div>
      </div>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        aria-label="بازگشت به صفحه اصلی"
        className={clsx('inline-flex rounded-lg transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2', className)}
      >
        {content}
      </Link>
    );
  }

  return <span className={clsx('inline-flex', className)}>{content}</span>;
}

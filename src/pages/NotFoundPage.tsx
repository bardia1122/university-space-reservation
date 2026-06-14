import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowRight, Compass } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAuthStore } from '../store/authStore';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const panelPath = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
      <div className="absolute top-6 right-6">
        <Logo size={36} to="/" />
      </div>

      <div className="text-center max-w-md">
        <p className="text-[7rem] sm:text-[9rem] font-extrabold leading-none bg-gradient-to-l from-primary-500 to-primary-800 bg-clip-text text-transparent select-none">
          ۴۰۴
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 dark:text-slate-100">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="text-gray-500 mt-3 leading-relaxed dark:text-slate-400">
          نشانی‌ای که وارد کرده‌اید وجود ندارد یا ممکن است حذف یا جابجا شده باشد.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link to="/" className="btn-primary">
            <Home size={18} />
            بازگشت به صفحه اصلی
          </Link>
          {isAuthenticated ? (
            <button onClick={() => navigate(panelPath)} className="btn-secondary">
              <Compass size={18} />
              پنل کاربری
            </button>
          ) : (
            <Link to="/login" className="btn-secondary">
              <Compass size={18} />
              ورود به سامانه
            </Link>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mt-6 transition-colors dark:text-slate-400 dark:hover:text-primary-400"
        >
          <ArrowRight size={16} />
          بازگشت به صفحه قبل
        </button>
      </div>
    </div>
  );
}

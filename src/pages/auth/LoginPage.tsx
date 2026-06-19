import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, User, ShieldCheck } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const next = searchParams.get('next');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      setAuth(result.user, result.access_token);
      const isAdmin = ['admin', 'super_admin'].includes(result.user.role);
      if (next) {
        navigate(next);
      } else {
        navigate(isAdmin ? '/admin' : '/dashboard');
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'خطا در ورود به سامانه');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Logo size={64} variant="stacked" to="/" />
          <p className="text-gray-500 mt-3 text-sm text-center dark:text-slate-400">
            ورود به سامانه یکپارچه دانشگاه
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 dark:text-slate-100">
            ورود به حساب کاربری
          </h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">ایمیل</label>
              <input
                type="email"
                className="input-field"
                placeholder="example@uk.ac.ir"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pl-10"
                  placeholder="حداقل ۸ کاراکتر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center">
              ورود به سامانه
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5 dark:text-slate-400">
            حساب کاربری ندارید؟{' '}
            <Link
              to="/register"
              className="text-primary-600 font-medium hover:underline dark:text-primary-400"
            >
              ثبت‌نام کنید
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="card p-4 mt-4 bg-blue-50 border-blue-100 dark:bg-primary-500/10 dark:border-primary-500/30">
          <p className="text-xs font-semibold text-blue-700 mb-2 dark:text-primary-300">
            حساب‌های آزمایشی:
          </p>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setEmail('student@uk.ac.ir');
                setPassword('password123');
              }}
              className="flex items-center gap-2 w-full text-right text-xs text-blue-600 hover:text-blue-800 transition-colors dark:text-primary-300 dark:hover:text-primary-200"
            >
              <User size={14} className="flex-shrink-0" />
              دانشجو: student@uk.ac.ir / password123
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@uk.ac.ir');
                setPassword('password123');
              }}
              className="flex items-center gap-2 w-full text-right text-xs text-blue-600 hover:text-blue-800 transition-colors dark:text-primary-300 dark:hover:text-primary-200"
            >
              <ShieldCheck size={14} className="flex-shrink-0" />
              مدیر: admin@uk.ac.ir / password123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

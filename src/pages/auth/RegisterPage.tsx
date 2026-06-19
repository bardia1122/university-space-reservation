import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    student_id: '',
    department: '',
    phone: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError((err as Error).message ?? 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-sm w-full">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            ثبت‌نام موفق
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">در حال انتقال به صفحه ورود...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Logo size={64} variant="stacked" to="/" />
          <p className="text-gray-500 dark:text-slate-400 mt-3 text-sm text-center">
            ایجاد حساب کاربری جدید
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-300">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">نام و نام خانوادگی *</label>
                <input
                  name="full_name"
                  type="text"
                  className="input-field"
                  placeholder="مثال: علی رضایی"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="label">ایمیل *</label>
                <input
                  name="email"
                  type="email"
                  className="input-field"
                  placeholder="example@uk.ac.ir"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="label">شماره دانشجویی</label>
                <input
                  name="student_id"
                  type="text"
                  className="input-field"
                  placeholder="۹۸XXXXXX"
                  value={form.student_id}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="label">شماره تماس</label>
                <input
                  name="phone"
                  type="tel"
                  className="input-field"
                  placeholder="۰۹XXXXXXXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label">دانشکده/بخش</label>
                <input
                  name="department"
                  type="text"
                  className="input-field"
                  placeholder="مهندسی کامپیوتر"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2">
                <label className="label">نوع کاربری *</label>
                <select
                  name="role"
                  className="input-field"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="student">دانشجو</option>
                  <option value="organization">تشکل دانشجویی</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="label">رمز عبور *</label>
                <input
                  name="password"
                  type="password"
                  className="input-field"
                  placeholder="حداقل ۸ کاراکتر"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center">
              ثبت‌نام
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-slate-400 mt-5">
            قبلاً ثبت‌نام کرده‌اید؟{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

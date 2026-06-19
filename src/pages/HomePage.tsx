import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CalendarCheck,
  BarChart3,
  MapPin,
  Users,
  Building2,
  Star,
  CalendarPlus,
  Layers,
  Settings,
} from 'lucide-react';
import { spacesApi } from '../api/spaces';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/common/Logo';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PublicSpaceCard } from '../components/spaces/PublicSpaceCard';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { spaceTypeLabels, spaceTypeIcons, spaceImage } from '../lib/spaceVisuals';
import type { Space, SpaceType } from '../types';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'شفافیت کامل',
    desc: 'فرآیند رزرو و تأیید کاملاً شفاف؛ وضعیت هر درخواست را لحظه‌ای دنبال کنید.',
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/15',
  },
  {
    icon: Clock,
    title: 'صرفه‌جویی در زمان',
    desc: 'بدون مراجعه حضوری و کاغذبازی، فضای مورد نظر را در چند ثانیه رزرو کنید.',
    color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/15',
  },
  {
    icon: CalendarCheck,
    title: 'رزرو آنلاین آسان',
    desc: 'تقویم دسترس‌پذیری فضاها را ببینید و زمان دلخواه خود را انتخاب کنید.',
    color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/15',
  },
  {
    icon: BarChart3,
    title: 'مدیریت هوشمند',
    desc: 'گزارش‌ها و تحلیل‌های دقیق برای مدیریت بهینهٔ فضاهای دانشگاه.',
    color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/15',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState<SpaceType | ''>('');
  const [infoSpace, setInfoSpace] = useState<Space | null>(null);

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['public-spaces'],
    queryFn: () => spacesApi.getAll(),
  });

  const activeSpaces = spaces.filter((s) => s.status === 'active');
  const filtered = typeFilter
    ? activeSpaces.filter((s) => s.space_type === typeFilter)
    : activeSpaces;

  const availableTypes = Array.from(new Set(activeSpaces.map((s) => s.space_type)));

  const handleReserve = (space: Space) => {
    if (isAdmin) {
      // Admins manage spaces rather than reserve them
      navigate('/admin/spaces');
    } else if (isAuthenticated) {
      navigate(`/spaces/${space.id}`);
    } else {
      navigate(`/login?next=/spaces/${space.id}`);
    }
  };

  const goToPanel = () => navigate(isAdmin ? '/admin' : '/dashboard');

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 dark:bg-slate-950/90 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={36} />
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600 dark:text-slate-300">
            <a
              href="#spaces"
              onClick={scrollToSection('spaces')}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              فضاها
            </a>
            <a
              href="#benefits"
              onClick={scrollToSection('benefits')}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              مزایا
            </a>
            <a
              href="#how"
              onClick={scrollToSection('how')}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              راهنما
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <button
                onClick={goToPanel}
                title="ورود به پنل کاربری"
                className="flex items-center gap-2 pr-1 pl-3 py-1 rounded-full border border-gray-200 hover:border-primary-300 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:hover:border-primary-500 dark:hover:bg-slate-800"
              >
                <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 dark:bg-primary-900/40">
                  <span className="text-primary-700 font-semibold text-sm dark:text-primary-300">
                    {user?.full_name?.[0] ?? '?'}
                  </span>
                </span>
                <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate hidden sm:inline dark:text-slate-200">
                  {user?.full_name}
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:inline-flex btn-secondary text-sm"
                >
                  ورود
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">
                  ثبت‌نام
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/spaces/hero.svg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary-900/85 via-primary-800/75 to-primary-900/85" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium mb-6">
            <Building2 size={14} />
            سامانه یکپارچهٔ رزرو فضاهای دانشگاه
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
            تجربهٔ آسان و شفاف رزرو و مدیریت فضاهای دانشگاهی
          </h1>
          <p className="text-primary-100 mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            زمین‌های ورزشی، سالن‌های همایش، پلاتوهای فرهنگی و غرفه‌های نمایشگاهی را به‌سادگی مشاهده
            و در چند گام رزرو کنید.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#spaces"
              onClick={scrollToSection('spaces')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              مشاهدهٔ فضاها
              <ArrowLeft size={18} />
            </a>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-colors"
              >
                ورود به سامانه
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Spaces ---------- */}
      <section id="spaces" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
            فضاهای قابل رزرو
          </h2>
          <p className="text-gray-500 mt-2 dark:text-slate-400">
            فضای مناسب رویداد خود را انتخاب کنید
          </p>
        </div>

        {/* type filter chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setTypeFilter('')}
            className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ${
              typeFilter === ''
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-primary-500'
            }`}
          >
            <Layers size={15} />
            همه
          </button>
          {availableTypes.map((t) => {
            const Icon = spaceTypeIcons[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ${
                  typeFilter === t
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-primary-500'
                }`}
              >
                <Icon size={15} />
                {spaceTypeLabels[t]}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((space) => (
              <PublicSpaceCard
                key={space.id}
                space={space}
                onReserve={handleReserve}
                onInfo={setInfoSpace}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Benefits ---------- */}
      <section
        id="benefits"
        className="bg-gray-50 border-y border-gray-100 scroll-mt-20 dark:bg-slate-900 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
              چرا این سامانه؟
            </h2>
            <p className="text-gray-500 mt-2 dark:text-slate-400">
              مزایای استفاده از سامانهٔ رزرو فضاها
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6 text-center">
                <div
                  className={`w-12 h-12 rounded-xl ${b.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <b.icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 dark:text-slate-100">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed dark:text-slate-400">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
            رزرو در سه گام
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              n: '۱',
              t: 'فضا را انتخاب کنید',
              d: 'از میان فضاهای موجود، گزینهٔ مناسب رویداد خود را بیابید.',
            },
            {
              n: '۲',
              t: 'درخواست رزرو ثبت کنید',
              d: 'تاریخ، ساعت و جزئیات فعالیت را وارد و درخواست را ارسال کنید.',
            },
            {
              n: '۳',
              t: 'تأیید را دریافت کنید',
              d: 'پس از بررسی مدیر، نتیجهٔ درخواست به شما اطلاع داده می‌شود.',
            },
          ].map((step) => (
            <div key={step.n} className="relative card p-6">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center mb-4">
                {step.n}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5 dark:text-slate-100">{step.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed dark:text-slate-400">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bg-gradient-to-l from-primary-700 to-primary-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            آمادهٔ رزرو فضای بعدی خود هستید؟
          </h2>
          <p className="text-primary-100 mt-3">
            همین حالا وارد شوید و رویداد خود را برنامه‌ریزی کنید.
          </p>
          <button
            onClick={() => (isAuthenticated ? goToPanel() : navigate('/login'))}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
          >
            {isAuthenticated ? 'ورود به پنل کاربری' : 'ورود / ثبت‌نام'}
            <ArrowLeft size={18} />
          </button>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={32} />
          <p className="text-sm text-gray-400 dark:text-slate-500">
            © ۱۴۰۵ سامانهٔ فضاهای دانشگاه — تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>

      {/* ---------- Info Modal ---------- */}
      <Modal
        open={infoSpace !== null}
        onClose={() => setInfoSpace(null)}
        title={infoSpace?.name ?? ''}
        size="lg"
      >
        {infoSpace && (
          <div className="space-y-5">
            <div className="relative h-52 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                src={spaceImage(infoSpace)}
                alt={infoSpace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant={infoSpace.status} />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                {(() => {
                  const Icon = spaceTypeIcons[infoSpace.space_type];
                  return <Icon size={16} className="text-primary-600 dark:text-primary-400" />;
                })()}
                {spaceTypeLabels[infoSpace.space_type]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-900 dark:text-slate-100">
                  {infoSpace.avg_rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400 dark:text-slate-500">
                  ({infoSpace.total_ratings} امتیاز)
                </span>
              </span>
            </div>

            {infoSpace.description && (
              <p className="text-sm text-gray-600 leading-relaxed dark:text-slate-300">
                {infoSpace.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {infoSpace.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <MapPin size={15} className="text-gray-400 dark:text-slate-500" />
                  <span>{infoSpace.location}</span>
                </div>
              )}
              {infoSpace.building && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <Building2 size={15} className="text-gray-400 dark:text-slate-500" />
                  <span>{infoSpace.building}</span>
                </div>
              )}
              {infoSpace.capacity && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <Users size={15} className="text-gray-400 dark:text-slate-500" />
                  <span>ظرفیت {infoSpace.capacity} نفر</span>
                </div>
              )}
              {infoSpace.floor && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <Layers size={15} className="text-gray-400 dark:text-slate-500" />
                  <span>{infoSpace.floor}</span>
                </div>
              )}
            </div>

            {infoSpace.amenities && infoSpace.amenities.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">
                  امکانات:
                </p>
                <div className="flex flex-wrap gap-2">
                  {infoSpace.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100 dark:bg-primary-500/15 dark:text-primary-300 dark:border-primary-500/25"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {infoSpace.rules && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl dark:bg-amber-500/10 dark:border-amber-500/25">
                <p className="text-xs font-semibold text-amber-700 mb-1 dark:text-amber-300">
                  قوانین استفاده:
                </p>
                <p className="text-xs text-amber-700 leading-relaxed dark:text-amber-200/90">
                  {infoSpace.rules}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  const s = infoSpace;
                  setInfoSpace(null);
                  handleReserve(s);
                }}
                disabled={!isAdmin && infoSpace.status !== 'active'}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdmin ? <Settings size={16} /> : <CalendarPlus size={16} />}
                {isAdmin ? 'مدیریت این فضا' : 'رزرو این فضا'}
              </button>
              <button onClick={() => setInfoSpace(null)} className="btn-secondary">
                بستن
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

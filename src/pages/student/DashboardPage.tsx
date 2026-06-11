import { useQuery } from '@tanstack/react-query';
import { Calendar, CheckCircle, Clock, XCircle, Plus, ArrowLeft, Megaphone, Lightbulb, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reservationsApi } from '../../api/reservations';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['my-reservations', user?.id],
    queryFn: () => reservationsApi.getMyReservations(user!.id),
    enabled: !!user,
  });

  const stats = [
    {
      label: 'کل رزروها',
      value: reservations.length,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'در انتظار بررسی',
      value: reservations.filter((r) => r.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'تأیید شده',
      value: reservations.filter((r) => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'رد شده',
      value: reservations.filter((r) => r.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  const recent = reservations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card p-6 bg-gradient-to-l from-primary-600 to-primary-800 text-white">
        <h2 className="text-xl font-bold mb-1">
          سلام، {user?.full_name}
        </h2>
        <p className="text-primary-100 text-sm">
          {user?.department ? `${user.department} — ` : ''}
          {user?.student_id ? `شماره دانشجویی: ${user.student_id}` : user?.role === 'organization' ? 'تشکل دانشجویی' : ''}
        </p>
        <button
          onClick={() => navigate('/spaces')}
          className="mt-4 inline-flex items-center gap-2 bg-white text-primary-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <Plus size={16} />
          رزرو فضای جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="section-title">آخرین رزروها</h3>
          <button
            onClick={() => navigate('/my-reservations')}
            className="text-sm text-primary-600 hover:underline flex items-center gap-1"
          >
            مشاهده همه <ArrowLeft size={14} />
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="هنوز رزروی ثبت نکرده‌اید"
            description="برای رزرو فضاهای دانشگاه از بخش فضاها اقدام کنید"
            action={{ label: 'مشاهده فضاها', onClick: () => navigate('/spaces') }}
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.activity_title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.space?.name} — {r.reservation_date}
                  </p>
                </div>
                <Badge variant={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'ثبت شکایت',
            desc: 'گزارش مشکلات فضاها',
            icon: Megaphone,
            to: '/spaces',
            color: 'bg-red-50 hover:bg-red-100',
            iconColor: 'text-red-600',
          },
          {
            label: 'پیشنهادات',
            desc: 'ایده‌های بهبود رویدادها',
            icon: Lightbulb,
            to: '/suggestions',
            color: 'bg-amber-50 hover:bg-amber-100',
            iconColor: 'text-amber-600',
          },
          {
            label: 'جزئیات فضاها',
            desc: 'مشاهده تمام فضاها',
            icon: Building2,
            to: '/spaces',
            color: 'bg-blue-50 hover:bg-blue-100',
            iconColor: 'text-blue-600',
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.to)}
            className={`card p-4 text-right transition-colors ${item.color}`}
          >
            <item.icon size={24} className={`${item.iconColor} mb-2`} />
            <p className="font-medium text-gray-900 text-sm">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

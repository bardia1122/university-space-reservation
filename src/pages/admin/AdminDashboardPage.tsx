import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  Users,
  Building2,
  AlertCircle,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { analyticsApi } from '../../api/analytics';
import { reservationsApi } from '../../api/reservations';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed'];

export function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: analyticsApi.getDashboardStats,
  });

  const { data: spaceUsage = [] } = useQuery({
    queryKey: ['space-usage'],
    queryFn: analyticsApi.getSpaceUsage,
  });

  const { data: pendingReservations = [] } = useQuery({
    queryKey: ['pending-reservations'],
    queryFn: () => reservationsApi.getAll({ status: 'pending' }),
  });

  if (statsLoading) return <LoadingSpinner fullPage />;

  const statCards = [
    {
      label: 'کل رزروها',
      value: stats?.total_reservations ?? 0,
      icon: CalendarDays,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'رزروهای معلق',
      value: stats?.pending_reservations ?? 0,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      label: 'تأیید شده',
      value: stats?.approved_reservations ?? 0,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      label: 'کاربران',
      value: stats?.total_users ?? 0,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      label: 'فضاها',
      value: stats?.total_spaces ?? 0,
      icon: Building2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    },
    {
      label: 'شکایات باز',
      value: stats?.open_complaints ?? 0,
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-500/10',
    },
    {
      label: 'میانگین امتیاز',
      value: stats?.avg_rating.toFixed(1) ?? '—',
      icon: Star,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    { label: 'بازخوردها', value: '—', icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const pieData = [
    { name: 'تأیید شده', value: stats?.approved_reservations ?? 0 },
    { name: 'معلق', value: stats?.pending_reservations ?? 0 },
    {
      name: 'سایر',
      value: Math.max(
        0,
        (stats?.total_reservations ?? 0) -
          (stats?.approved_reservations ?? 0) -
          (stats?.pending_reservations ?? 0),
      ),
    },
  ].filter((d) => d.value > 0);

  const topSpaces = [...spaceUsage]
    .sort((a, b) => b.total_reservations - a.total_reservations)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div
              className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}
            >
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="section-title mb-4">آمار استفاده از فضاها</h3>
          {topSpaces.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topSpaces} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="space_name"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v: string) => (v.length > 10 ? v.slice(0, 10) + '…' : v)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'total_reservations'
                      ? 'کل رزروها'
                      : name === 'approved_count'
                        ? 'تأیید شده'
                        : name,
                  ]}
                />
                <Bar
                  dataKey="total_reservations"
                  fill="#bfdbfe"
                  name="total_reservations"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="approved_count"
                  fill="#2563eb"
                  name="approved_count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-slate-500 text-sm">
              داده‌ای موجود نیست
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="section-title mb-4">وضعیت رزروها</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-slate-500 text-sm">
              داده‌ای موجود نیست
            </div>
          )}
        </div>
      </div>

      {/* Pending Reservations */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="section-title">رزروهای معلق نیازمند بررسی</h3>
          <span className="badge bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300">
            {pendingReservations.length} مورد
          </span>
        </div>
        {pendingReservations.length === 0 ? (
          <div className="py-8 text-center text-gray-400 dark:text-slate-500 text-sm">
            هیچ رزرو معلقی وجود ندارد
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-xs">
                  <th className="px-5 py-3 font-medium text-right">فعالیت</th>
                  <th className="px-5 py-3 font-medium text-right hidden md:table-cell">فضا</th>
                  <th className="px-5 py-3 font-medium text-right hidden sm:table-cell">کاربر</th>
                  <th className="px-5 py-3 font-medium text-right">تاریخ</th>
                  <th className="px-5 py-3 font-medium text-right">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {pendingReservations.slice(0, 5).map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-slate-100 max-w-xs truncate">
                      {r.activity_title}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-slate-300 hidden md:table-cell">
                      {r.space?.name ?? `فضا ${r.space_id}`}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-slate-300 hidden sm:table-cell">
                      {r.user?.full_name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                      {r.reservation_date}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

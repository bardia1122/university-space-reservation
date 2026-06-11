import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { analyticsApi } from '../../api/analytics';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StarRating } from '../../components/common/StarRating';

export function AdminAnalyticsPage() {
  const { data: spaceUsage = [], isLoading } = useQuery({
    queryKey: ['space-usage'],
    queryFn: analyticsApi.getSpaceUsage,
  });

  if (isLoading) return <LoadingSpinner />;

  const radarData = spaceUsage.slice(0, 6).map((s) => ({
    space: s.space_name.slice(0, 12),
    امتیاز: s.avg_rating,
    رزرو: Math.min(s.total_reservations * 10, 100),
  }));

  return (
    <div className="space-y-6">
      {/* Space Usage Bar Chart */}
      <div className="card p-5">
        <h3 className="section-title mb-4">مقایسه استفاده از فضاها</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={spaceUsage} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="space_name"
              tick={{ fontSize: 10 }}
              tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
              angle={-25}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="total_reservations" name="کل رزروها" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
            <Bar dataKey="approved_count" name="تأیید شده" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected_count" name="رد شده" fill="#fca5a5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar Chart */}
        <div className="card p-5">
          <h3 className="section-title mb-4">نمای کلی عملکرد فضاها</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="space" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 9 }} />
              <Radar name="امتیاز" dataKey="امتیاز" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="card p-5">
          <h3 className="section-title mb-4">جدول آمار تفصیلی</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs">
                  <th className="pb-2 text-right font-semibold">فضا</th>
                  <th className="pb-2 text-right font-semibold">رزرو</th>
                  <th className="pb-2 text-right font-semibold">تأیید</th>
                  <th className="pb-2 text-right font-semibold">امتیاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {spaceUsage.map((s) => (
                  <tr key={s.space_id} className="hover:bg-gray-50">
                    <td className="py-2.5 font-medium text-gray-900 truncate max-w-[120px]">
                      {s.space_name}
                    </td>
                    <td className="py-2.5 text-gray-600">{s.total_reservations}</td>
                    <td className="py-2.5 text-green-600">{s.approved_count}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1">
                        <StarRating value={Math.round(s.avg_rating)} readonly size="sm" />
                        <span className="text-xs text-gray-400">{s.avg_rating.toFixed(1)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

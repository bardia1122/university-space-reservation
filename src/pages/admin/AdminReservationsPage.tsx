import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Filter, CalendarDays } from 'lucide-react';
import { reservationsApi } from '../../api/reservations';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import type { ReservationStatus } from '../../types';

const statusFilters: { value: ReservationStatus | ''; label: string }[] = [
  { value: '', label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'approved', label: 'تأیید شده' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'cancelled', label: 'لغو شده' },
];

const activityLabels: Record<string, string> = {
  sports: 'ورزشی',
  cultural: 'فرهنگی',
  educational: 'آموزشی',
  conference: 'کنفرانس',
  exhibition: 'نمایشگاهی',
  festival: 'جشنواره',
  other: 'سایر',
};

export function AdminReservationsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [adminNote, setAdminNote] = useState('');

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['admin-reservations', statusFilter],
    queryFn: () => reservationsApi.getAll(statusFilter ? { status: statusFilter } : undefined),
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      reservationsApi.review(reviewId!, reviewAction, adminNote || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reservations'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      qc.invalidateQueries({ queryKey: ['pending-reservations'] });
      setReviewId(null);
      setAdminNote('');
    },
  });

  const openReview = (id: number, action: 'approved' | 'rejected') => {
    setReviewId(id);
    setReviewAction(action);
    setAdminNote('');
  };

  return (
    <div className="space-y-5">
      {/* Filter */}
      <div className="card p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 dark:text-slate-500" />
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-800 hover:border-primary-300'
              }`}
            >
              {f.label}
              {f.value === 'pending' && (
                <span className="mr-1 bg-amber-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {reservations.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <EmptyState icon={CalendarDays} title="رزروی یافت نشد" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-xs">
                  <th className="px-4 py-3 font-semibold text-right">فعالیت</th>
                  <th className="px-4 py-3 font-semibold text-right hidden lg:table-cell">فضا</th>
                  <th className="px-4 py-3 font-semibold text-right hidden md:table-cell">کاربر</th>
                  <th className="px-4 py-3 font-semibold text-right">تاریخ و ساعت</th>
                  <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">نوع</th>
                  <th className="px-4 py-3 font-semibold text-right">وضعیت</th>
                  <th className="px-4 py-3 font-semibold text-right">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="max-w-[160px]">
                        <p className="font-medium text-gray-900 dark:text-slate-100 truncate">{r.activity_title}</p>
                        {r.organization_name && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">{r.organization_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden lg:table-cell">
                      {r.space?.name ?? `#${r.space_id}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden md:table-cell">
                      <p>{r.user?.full_name ?? '—'}</p>
                      {r.user?.department && (
                        <p className="text-xs text-gray-400 dark:text-slate-500">{r.user.department}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                      <p>{r.reservation_date}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {r.start_time.slice(0, 5)} - {r.end_time.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden sm:table-cell">
                      {activityLabels[r.activity_type] ?? r.activity_type}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openReview(r.id, 'approved')}
                            className="p-1.5 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 transition-colors"
                            title="تأیید"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => openReview(r.id, 'rejected')}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="رد"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={reviewId !== null}
        onClose={() => setReviewId(null)}
        title={reviewAction === 'approved' ? 'تأیید رزرو' : 'رد رزرو'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {reviewAction === 'approved'
              ? 'آیا می‌خواهید این رزرو را تأیید کنید؟'
              : 'لطفاً دلیل رد رزرو را وارد کنید.'}
          </p>
          <div>
            <label className="label">یادداشت {reviewAction === 'rejected' ? '(اجباری)' : '(اختیاری)'}</label>
            <textarea
              className="input-field min-h-20 resize-none"
              placeholder={
                reviewAction === 'approved'
                  ? 'پیام به متقاضی (اختیاری)...'
                  : 'دلیل رد درخواست را بنویسید...'
              }
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant={reviewAction === 'approved' ? 'primary' : 'danger'}
              loading={reviewMutation.isPending}
              disabled={reviewAction === 'rejected' && !adminNote.trim()}
              onClick={() => reviewMutation.mutate()}
              className="flex-1 justify-center"
            >
              {reviewAction === 'approved' ? (
                <><CheckCircle size={15} /> تأیید</>
              ) : (
                <><XCircle size={15} /> رد</>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setReviewId(null)}>
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarX, Filter } from 'lucide-react';
import { reservationsApi } from '../../api/reservations';
import { useAuthStore } from '../../store/authStore';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import type { ReservationStatus } from '../../types';

const statusFilters: { value: ReservationStatus | ''; label: string }[] = [
  { value: '', label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'approved', label: 'تأیید شده' },
  { value: 'rejected', label: 'رد شده' },
  { value: 'cancelled', label: 'لغو شده' },
  { value: 'completed', label: 'انجام شده' },
];

export function MyReservationsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [cancelId, setCancelId] = useState<number | null>(null);

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['my-reservations', user?.id, statusFilter],
    queryFn: () => reservationsApi.getMyReservations(user!.id, statusFilter || undefined),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-reservations'] });
      setCancelId(null);
    },
  });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="card p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 dark:text-slate-500" />
          <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">فیلتر:</span>
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
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="هیچ رزروی یافت نشد"
          description="درخواست‌های رزرو شما اینجا نمایش داده می‌شود"
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-slate-400 px-1">
            {reservations.length} رزرو
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((r) => (
              <ReservationCard key={r.id} reservation={r} onCancel={(id) => setCancelId(id)} />
            ))}
          </div>
        </div>
      )}

      {/* Cancel confirmation modal */}
      <Modal open={cancelId !== null} onClose={() => setCancelId(null)} title="لغو رزرو" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            آیا از لغو این رزرو مطمئن هستید؟ این عمل قابل بازگشت نیست.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              loading={cancelMutation.isPending}
              onClick={() => cancelId && cancelMutation.mutate(cancelId)}
              className="flex-1 justify-center"
            >
              بله، لغو شود
            </Button>
            <Button variant="secondary" onClick={() => setCancelId(null)}>
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

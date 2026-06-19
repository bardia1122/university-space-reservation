import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { Reservation } from '../../types';

const activityLabels: Record<string, string> = {
  sports: 'ورزشی',
  cultural: 'فرهنگی',
  educational: 'آموزشی',
  conference: 'کنفرانس',
  exhibition: 'نمایشگاهی',
  festival: 'جشنواره',
  other: 'سایر',
};

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: number) => void;
  showUser?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export function ReservationCard({
  reservation,
  onCancel,
  showUser,
  onApprove,
  onReject,
}: ReservationCardProps) {
  const canCancel = reservation.status === 'pending' || reservation.status === 'approved';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-900 truncate dark:text-slate-100">
              {reservation.activity_title}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 dark:bg-slate-800 dark:text-slate-300">
              {activityLabels[reservation.activity_type]}
            </span>
          </div>
          {reservation.space && (
            <p className="text-sm text-gray-500 dark:text-slate-400">{reservation.space.name}</p>
          )}
          {showUser && reservation.user && (
            <p className="text-xs text-gray-400 mt-0.5 dark:text-slate-500">
              {reservation.user.full_name}
            </p>
          )}
        </div>
        <Badge variant={reservation.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
          <Calendar size={14} className="text-gray-400 flex-shrink-0 dark:text-slate-500" />
          <span>{reservation.reservation_date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
          <Clock size={14} className="text-gray-400 flex-shrink-0 dark:text-slate-500" />
          <span>
            {reservation.start_time.slice(0, 5)} - {reservation.end_time.slice(0, 5)}
          </span>
        </div>
        {reservation.expected_attendees && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
            <Users size={14} className="text-gray-400 flex-shrink-0 dark:text-slate-500" />
            <span>{reservation.expected_attendees} نفر</span>
          </div>
        )}
        {reservation.organization_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
            <MapPin size={14} className="text-gray-400 flex-shrink-0 dark:text-slate-500" />
            <span className="truncate">{reservation.organization_name}</span>
          </div>
        )}
      </div>

      {reservation.admin_note && (
        <div className="note mb-4">
          <span className="font-medium text-gray-700 dark:text-slate-200">یادداشت مدیر: </span>
          {reservation.admin_note}
        </div>
      )}

      {onCancel && canCancel && (
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => onCancel(reservation.id)}>
            لغو رزرو
          </Button>
        </div>
      )}

      {(onApprove || onReject) && reservation.status === 'pending' && (
        <div className="flex gap-2 justify-end">
          {onReject && (
            <Button variant="danger" size="sm" onClick={() => onReject(reservation.id)}>
              رد
            </Button>
          )}
          {onApprove && (
            <Button variant="primary" size="sm" onClick={() => onApprove(reservation.id)}>
              تأیید
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

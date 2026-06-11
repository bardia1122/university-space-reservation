import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MapPin, Users, Clock, Shield, CheckCircle, Star,
  Calendar, ChevronRight, Send, MessageSquare, AlertTriangle, Settings, ShieldCheck,
} from 'lucide-react';
import { spacesApi } from '../../api/spaces';
import { reservationsApi } from '../../api/reservations';
import { feedbackApi } from '../../api/feedback';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import type { ActivityType, RatingCreate } from '../../types';

const activityOptions: { value: ActivityType; label: string }[] = [
  { value: 'sports', label: 'ورزشی' },
  { value: 'cultural', label: 'فرهنگی' },
  { value: 'educational', label: 'آموزشی' },
  { value: 'conference', label: 'کنفرانس' },
  { value: 'exhibition', label: 'نمایشگاهی' },
  { value: 'festival', label: 'جشنواره' },
  { value: 'other', label: 'سایر' },
];

export function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const qc = useQueryClient();

  const [reserveModal, setReserveModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);

  const [reserveForm, setReserveForm] = useState({
    reservation_date: '',
    start_time: '',
    end_time: '',
    activity_type: 'sports' as ActivityType,
    activity_title: '',
    activity_description: '',
    expected_attendees: '',
    organization_name: '',
  });

  const [ratingForm, setRatingForm] = useState<RatingCreate>({
    space_id: Number(id),
    overall_score: 0,
    cleanliness_score: 0,
    equipment_score: 0,
    management_score: 0,
    comment: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({ content: '', is_anonymous: false });
  const [successMsg, setSuccessMsg] = useState('');

  const { data: space, isLoading } = useQuery({
    queryKey: ['space', id],
    queryFn: () => spacesApi.getById(Number(id)),
  });

  const { data: ratings = [] } = useQuery({
    queryKey: ['ratings', id],
    queryFn: () => feedbackApi.getSpaceRatings(Number(id)),
  });

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['feedbacks', id],
    queryFn: () => feedbackApi.getSpaceFeedbacks(Number(id)),
  });

  const reserveMutation = useMutation({
    mutationFn: () =>
      reservationsApi.create(
        {
          space_id: Number(id),
          reservation_date: reserveForm.reservation_date,
          start_time: reserveForm.start_time + ':00',
          end_time: reserveForm.end_time + ':00',
          activity_type: reserveForm.activity_type,
          activity_title: reserveForm.activity_title,
          activity_description: reserveForm.activity_description || undefined,
          expected_attendees: reserveForm.expected_attendees ? Number(reserveForm.expected_attendees) : undefined,
          organization_name: reserveForm.organization_name || undefined,
        },
        user!.id,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-reservations'] });
      setReserveModal(false);
      setSuccessMsg('درخواست رزرو با موفقیت ثبت شد و در انتظار بررسی است');
      setTimeout(() => setSuccessMsg(''), 4000);
    },
  });

  const ratingMutation = useMutation({
    mutationFn: () => feedbackApi.createRating(ratingForm, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ratings', id] });
      setRatingModal(false);
      setSuccessMsg('امتیاز شما با موفقیت ثبت شد');
      setTimeout(() => setSuccessMsg(''), 4000);
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: () =>
      feedbackApi.createFeedback(
        { space_id: Number(id), ...feedbackForm },
        user!.id,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedbacks', id] });
      setFeedbackModal(false);
      setFeedbackForm({ content: '', is_anonymous: false });
      setSuccessMsg('بازخورد شما ثبت شد');
      setTimeout(() => setSuccessMsg(''), 4000);
    },
  });

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!space) return <div className="text-center py-20 text-gray-400">فضا یافت نشد</div>;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/spaces')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ChevronRight size={16} />
        بازگشت به فضاها
      </button>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Space Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
              <Badge variant={space.status} />
            </div>
            {space.name_en && <p className="text-gray-400 text-sm">{space.name_en}</p>}
          </div>
          <div className="flex items-center gap-1.5">
            <Star size={18} className="fill-amber-400 text-amber-400" />
            <span className="text-lg font-bold text-gray-900">{space.avg_rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({space.total_ratings} امتیاز)</span>
          </div>
        </div>

        {space.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{space.description}</p>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {space.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={15} className="text-gray-400" />
              <span>{space.location}</span>
            </div>
          )}
          {space.capacity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={15} className="text-gray-400" />
              <span>ظرفیت {space.capacity} نفر</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400" />
            <span>حداقل {space.min_advance_hours} ساعت قبل</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={15} className="text-gray-400" />
            <span>حداکثر {space.advance_booking_days} روز آینده</span>
          </div>
          {space.requires_admin_approval && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Shield size={15} />
              <span>نیاز به تأیید مدیر</span>
            </div>
          )}
        </div>

        {/* Amenities */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">امکانات:</p>
            <div className="flex flex-wrap gap-2">
              {space.amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rules */}
        {space.rules && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-1">قوانین استفاده:</p>
                <p className="text-xs text-amber-700 leading-relaxed">{space.rules}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons — admins manage spaces, they do not reserve them */}
        {isAdmin ? (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-2 p-3 mb-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
              <span>شما با نقش مدیر وارد شده‌اید. رزرو فضا مخصوص دانشجویان و تشکل‌هاست؛ از بخش مدیریت می‌توانید این فضا را ویرایش یا مدیریت کنید.</span>
            </div>
            <Button onClick={() => navigate('/admin/spaces')}>
              <Settings size={16} />
              مدیریت فضاها
            </Button>
          </div>
        ) : (
          space.status === 'active' && (
            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
              <Button onClick={() => setReserveModal(true)}>
                <Calendar size={16} />
                رزرو این فضا
              </Button>
              <Button variant="secondary" onClick={() => setRatingModal(true)}>
                <Star size={16} />
                ثبت امتیاز
              </Button>
              <Button variant="secondary" onClick={() => setFeedbackModal(true)}>
                <MessageSquare size={16} />
                ثبت بازخورد
              </Button>
            </div>
          )
        )}
      </div>

      {/* Ratings section */}
      {ratings.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title mb-4">نظرات و امتیازات ({ratings.length})</h3>
          <div className="space-y-3">
            {ratings.map((rating) => (
              <div key={rating.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 text-xs font-semibold">
                        {rating.user?.full_name?.[0] ?? '?'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{rating.user?.full_name ?? 'کاربر'}</span>
                  </div>
                  <StarRating value={rating.overall_score} readonly size="sm" />
                </div>
                {rating.comment && (
                  <p className="text-sm text-gray-600 mt-1">{rating.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">{rating.created_at.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedbacks section */}
      {feedbacks.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title mb-4">بازخوردها ({feedbacks.length})</h3>
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 text-xs font-semibold">
                      {fb.is_anonymous ? '؟' : fb.user?.full_name?.[0] ?? '?'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {fb.is_anonymous ? 'ناشناس' : (fb.user?.full_name ?? 'کاربر')}
                  </span>
                  {fb.sentiment && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      fb.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                      fb.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {fb.sentiment === 'positive' ? 'مثبت' : fb.sentiment === 'negative' ? 'منفی' : 'خنثی'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{fb.content}</p>
                <p className="text-xs text-gray-400 mt-2">{fb.created_at.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reserve Modal */}
      <Modal open={reserveModal} onClose={() => setReserveModal(false)} title="رزرو فضا" size="lg">
        <form
          onSubmit={(e) => { e.preventDefault(); reserveMutation.mutate(); }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">عنوان فعالیت *</label>
              <input
                className="input-field"
                placeholder="مثال: جلسه تمرین تیم فوتبال"
                value={reserveForm.activity_title}
                onChange={(e) => setReserveForm((p) => ({ ...p, activity_title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">نوع فعالیت *</label>
              <select
                className="input-field"
                value={reserveForm.activity_type}
                onChange={(e) => setReserveForm((p) => ({ ...p, activity_type: e.target.value as ActivityType }))}
              >
                {activityOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">تاریخ *</label>
              <input
                type="date"
                className="input-field"
                value={reserveForm.reservation_date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setReserveForm((p) => ({ ...p, reservation_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">ساعت شروع *</label>
              <input
                type="time"
                className="input-field"
                value={reserveForm.start_time}
                onChange={(e) => setReserveForm((p) => ({ ...p, start_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">ساعت پایان *</label>
              <input
                type="time"
                className="input-field"
                value={reserveForm.end_time}
                onChange={(e) => setReserveForm((p) => ({ ...p, end_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">تعداد شرکت‌کننده</label>
              <input
                type="number"
                className="input-field"
                placeholder="تعداد نفرات"
                value={reserveForm.expected_attendees}
                onChange={(e) => setReserveForm((p) => ({ ...p, expected_attendees: e.target.value }))}
                min="1"
                max={space.capacity ?? 9999}
              />
            </div>
            <div>
              <label className="label">نام تشکل (اختیاری)</label>
              <input
                className="input-field"
                placeholder="نام سازمان یا تشکل"
                value={reserveForm.organization_name}
                onChange={(e) => setReserveForm((p) => ({ ...p, organization_name: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">توضیحات (اختیاری)</label>
              <textarea
                className="input-field min-h-20 resize-none"
                placeholder="توضیحات بیشتر درباره فعالیت..."
                value={reserveForm.activity_description}
                onChange={(e) => setReserveForm((p) => ({ ...p, activity_description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={reserveMutation.isPending} className="flex-1 justify-center">
              ثبت درخواست رزرو
            </Button>
            <Button type="button" variant="secondary" onClick={() => setReserveModal(false)}>
              انصراف
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rating Modal */}
      <Modal open={ratingModal} onClose={() => setRatingModal(false)} title="ثبت امتیاز">
        <div className="space-y-4">
          {[
            { key: 'overall_score', label: 'امتیاز کلی *' },
            { key: 'cleanliness_score', label: 'نظافت' },
            { key: 'equipment_score', label: 'تجهیزات' },
            { key: 'management_score', label: 'مدیریت' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{item.label}</label>
              <StarRating
                value={(ratingForm as unknown as Record<string, number>)[item.key] ?? 0}
                onChange={(v) => setRatingForm((p) => ({ ...p, [item.key]: v }))}
              />
            </div>
          ))}
          <div>
            <label className="label">نظر (اختیاری)</label>
            <textarea
              className="input-field min-h-20 resize-none"
              placeholder="نظر خود را بنویسید..."
              value={ratingForm.comment ?? ''}
              onChange={(e) => setRatingForm((p) => ({ ...p, comment: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => ratingMutation.mutate()}
              loading={ratingMutation.isPending}
              disabled={!ratingForm.overall_score}
              className="flex-1 justify-center"
            >
              <Send size={15} />
              ثبت امتیاز
            </Button>
            <Button variant="secondary" onClick={() => setRatingModal(false)}>
              انصراف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal open={feedbackModal} onClose={() => setFeedbackModal(false)} title="ثبت بازخورد">
        <div className="space-y-4">
          <div>
            <label className="label">بازخورد شما *</label>
            <textarea
              className="input-field min-h-28 resize-none"
              placeholder="تجربه خود از استفاده از این فضا را بنویسید..."
              value={feedbackForm.content}
              onChange={(e) => setFeedbackForm((p) => ({ ...p, content: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={feedbackForm.is_anonymous}
              onChange={(e) => setFeedbackForm((p) => ({ ...p, is_anonymous: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-gray-700">ارسال به صورت ناشناس</span>
          </label>
          <div className="flex gap-3">
            <Button
              onClick={() => feedbackMutation.mutate()}
              loading={feedbackMutation.isPending}
              disabled={!feedbackForm.content.trim()}
              className="flex-1 justify-center"
            >
              <Send size={15} />
              ثبت بازخورد
            </Button>
            <Button variant="secondary" onClick={() => setFeedbackModal(false)}>
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

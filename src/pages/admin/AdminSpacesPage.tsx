import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { spacesApi } from '../../api/spaces';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { StarRating } from '../../components/common/StarRating';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import type { Space, SpaceType } from '../../types';

const spaceTypeOptions: { value: SpaceType; label: string }[] = [
  { value: 'football_field', label: 'زمین فوتبال' },
  { value: 'futsal_field', label: 'زمین فوتسال' },
  { value: 'cultural_plaza', label: 'پلاتوی فرهنگی' },
  { value: 'seminar_hall', label: 'سالن سمینار' },
  { value: 'conference_hall', label: 'سالن کنفرانس' },
  { value: 'exhibition_booth', label: 'غرفه نمایشگاهی' },
  { value: 'festival_booth', label: 'غرفه جشنواره' },
];

const spaceTypeLabels: Record<string, string> = Object.fromEntries(
  spaceTypeOptions.map((o) => [o.value, o.label])
);

const defaultForm = {
  name: '',
  name_en: '',
  space_type: 'seminar_hall' as SpaceType,
  description: '',
  capacity: '',
  location: '',
  floor: '',
  building: '',
  status: 'active' as 'active' | 'maintenance' | 'inactive',
  rules: '',
  amenities_raw: '',
  requires_admin_approval: true,
  advance_booking_days: 30,
  min_advance_hours: 24,
};

export function AdminSpacesPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editSpace, setEditSpace] = useState<Space | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: () => spacesApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      spacesApi.create({
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        amenities: form.amenities_raw ? form.amenities_raw.split('،').map((s) => s.trim()) : [],
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spaces'] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      spacesApi.update(editSpace!.id, {
        name: form.name,
        description: form.description || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        status: form.status,
        rules: form.rules || undefined,
        amenities: form.amenities_raw ? form.amenities_raw.split('،').map((s) => s.trim()) : [],
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spaces'] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => spacesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spaces'] }); setDeleteId(null); },
  });

  const openCreate = () => {
    setEditSpace(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const openEdit = (space: Space) => {
    setEditSpace(space);
    setForm({
      name: space.name,
      name_en: space.name_en ?? '',
      space_type: space.space_type,
      description: space.description ?? '',
      capacity: space.capacity?.toString() ?? '',
      location: space.location ?? '',
      floor: space.floor ?? '',
      building: space.building ?? '',
      status: space.status,
      rules: space.rules ?? '',
      amenities_raw: space.amenities?.join('، ') ?? '',
      requires_admin_approval: space.requires_admin_approval,
      advance_booking_days: space.advance_booking_days,
      min_advance_hours: space.min_advance_hours,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditSpace(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editSpace) updateMutation.mutate();
    else createMutation.mutate();
  };

  const isLoading_ = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus size={16} />
          افزودن فضای جدید
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-xs">
                  <th className="px-4 py-3 font-semibold text-right">نام فضا</th>
                  <th className="px-4 py-3 font-semibold text-right hidden md:table-cell">نوع</th>
                  <th className="px-4 py-3 font-semibold text-right hidden lg:table-cell">مکان</th>
                  <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">ظرفیت</th>
                  <th className="px-4 py-3 font-semibold text-right">امتیاز</th>
                  <th className="px-4 py-3 font-semibold text-right">وضعیت</th>
                  <th className="px-4 py-3 font-semibold text-right">اقدام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                {spaces.map((space) => (
                  <tr key={space.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-slate-100">{space.name}</p>
                      {space.name_en && <p className="text-xs text-gray-400 dark:text-slate-500">{space.name_en}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden md:table-cell">
                      {spaceTypeLabels[space.space_type] ?? space.space_type}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden lg:table-cell max-w-[150px] truncate">
                      {space.location ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 hidden sm:table-cell">
                      {space.capacity ? `${space.capacity} نفر` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <StarRating value={Math.round(space.avg_rating)} readonly size="sm" />
                        <span className="text-xs text-gray-400 dark:text-slate-500">({space.total_ratings})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={space.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => openEdit(space)}
                          className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(space.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editSpace ? 'ویرایش فضا' : 'افزودن فضای جدید'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">نام فضا *</label>
              <input className="input-field" required value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">نام انگلیسی</label>
              <input className="input-field" value={form.name_en}
                onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))} />
            </div>
            {!editSpace && (
              <div>
                <label className="label">نوع فضا *</label>
                <select className="input-field" value={form.space_type}
                  onChange={(e) => setForm((p) => ({ ...p, space_type: e.target.value as SpaceType }))}>
                  {spaceTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="label">وضعیت</label>
              <select className="input-field" value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as typeof form.status }))}>
                <option value="active">فعال</option>
                <option value="maintenance">در تعمیر</option>
                <option value="inactive">غیرفعال</option>
              </select>
            </div>
            <div>
              <label className="label">ظرفیت (نفر)</label>
              <input type="number" className="input-field" min="1" value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} />
            </div>
            <div>
              <label className="label">مکان</label>
              <input className="input-field" value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <label className="label">ساختمان</label>
              <input className="input-field" value={form.building}
                onChange={(e) => setForm((p) => ({ ...p, building: e.target.value }))} />
            </div>
            <div>
              <label className="label">طبقه</label>
              <input className="input-field" value={form.floor}
                onChange={(e) => setForm((p) => ({ ...p, floor: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">امکانات (با ، جدا کنید)</label>
              <input className="input-field" placeholder="پروژکتور، WiFi، تهویه مطبوع"
                value={form.amenities_raw}
                onChange={(e) => setForm((p) => ({ ...p, amenities_raw: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">توضیحات</label>
              <textarea className="input-field min-h-20 resize-none" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">قوانین استفاده</label>
              <textarea className="input-field min-h-16 resize-none" value={form.rules}
                onChange={(e) => setForm((p) => ({ ...p, rules: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isLoading_} className="flex-1 justify-center">
              {editSpace ? 'ذخیره تغییرات' : 'افزودن فضا'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeModal}>انصراف</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="حذف فضا" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-slate-300">
            آیا مطمئن هستید که می‌خواهید این فضا را حذف کنید؟ این عمل برگشت‌پذیر نیست.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              loading={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="flex-1 justify-center"
            >
              حذف
            </Button>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>انصراف</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

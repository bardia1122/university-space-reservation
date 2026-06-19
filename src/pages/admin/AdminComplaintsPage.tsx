import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, ChevronDown, ChevronUp, Filter, Sparkles } from 'lucide-react';
import { feedbackApi } from '../../api/feedback';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const statusFilters = [
  { value: '', label: 'همه' },
  { value: 'open', label: 'باز' },
  { value: 'in_progress', label: 'در حال بررسی' },
  { value: 'resolved', label: 'رفع شده' },
  { value: 'closed', label: 'بسته' },
];

const categoryLabels: Record<string, string> = {
  noise: 'سروصدا',
  equipment: 'تجهیزات',
  management: 'مدیریت',
  cleanliness: 'نظافت',
  safety: 'ایمنی',
  other: 'سایر',
};

export function AdminComplaintsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [respondId, setRespondId] = useState<number | null>(null);
  const [responseForm, setResponseForm] = useState({ admin_response: '', status: 'in_progress' });

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['admin-complaints', statusFilter],
    queryFn: () => feedbackApi.getAllComplaints(statusFilter || undefined),
  });

  const respondMutation = useMutation({
    mutationFn: () =>
      feedbackApi.respondComplaint(respondId!, responseForm.admin_response, responseForm.status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-complaints'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      setRespondId(null);
      setResponseForm({ admin_response: '', status: 'in_progress' });
    },
  });

  const priorityLabel = (p: number) => {
    if (p >= 4)
      return {
        label: 'بحرانی',
        color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
      };
    if (p >= 3) return { label: 'بالا', color: 'text-orange-600 bg-orange-50' };
    if (p >= 2)
      return {
        label: 'متوسط',
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
      };
    return {
      label: 'پایین',
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10',
    };
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
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState icon={MessageSquare} title="شکایتی یافت نشد" />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => {
            const prio = priorityLabel(c.priority);
            const isExpanded = expandedId === c.id;
            return (
              <div key={c.id} className="card overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-medium">
                          {categoryLabels[c.category] ?? c.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${prio.color}`}
                        >
                          {prio.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">
                        {c.title}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                        {c.is_anonymous ? 'ناشناس' : (c.user?.full_name ?? '—')} •{' '}
                        {c.created_at.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={c.status} />
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400 dark:text-slate-500" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400 dark:text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-800 pt-3 space-y-3 animate-fade-in">
                    <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
                      {c.description}
                    </p>

                    {c.ai_analysis && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-100">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                          <Sparkles size={13} />
                          تحلیل هوش مصنوعی:
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          {c.ai_analysis}
                        </p>
                      </div>
                    )}

                    {c.admin_response && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-100 dark:border-blue-500/30">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                          پاسخ مدیر:
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {c.admin_response}
                        </p>
                        {c.responded_at && (
                          <p className="text-xs text-blue-400 mt-1">
                            {c.responded_at.slice(0, 10)}
                          </p>
                        )}
                      </div>
                    )}

                    {c.status !== 'resolved' && c.status !== 'closed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRespondId(c.id);
                        }}
                      >
                        پاسخ دادن
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Respond Modal */}
      <Modal open={respondId !== null} onClose={() => setRespondId(null)} title="پاسخ به شکایت">
        <div className="space-y-4">
          <div>
            <label className="label">پاسخ مدیر *</label>
            <textarea
              className="input-field min-h-28 resize-none"
              placeholder="پاسخ خود به این شکایت را بنویسید..."
              value={responseForm.admin_response}
              onChange={(e) => setResponseForm((p) => ({ ...p, admin_response: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">وضعیت جدید</label>
            <select
              className="input-field"
              value={responseForm.status}
              onChange={(e) => setResponseForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="in_progress">در حال بررسی</option>
              <option value="resolved">رفع شده</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button
              loading={respondMutation.isPending}
              disabled={!responseForm.admin_response.trim()}
              onClick={() => respondMutation.mutate()}
              className="flex-1 justify-center"
            >
              ارسال پاسخ
            </Button>
            <Button variant="secondary" onClick={() => setRespondId(null)}>
              انصراف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

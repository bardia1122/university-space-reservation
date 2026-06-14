import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, Plus, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { feedbackApi } from '../../api/feedback';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

const categoryLabels: Record<string, string> = {
  educational: 'آموزشی',
  cultural: 'فرهنگی',
  facilities: 'امکانات',
  sports: 'ورزشی',
  system: 'سامانه',
  other: 'سایر',
};

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));

const statusLabels: Record<string, string> = {
  pending: 'در انتظار بررسی',
  under_review: 'در حال بررسی',
  approved: 'تأیید شده',
  rejected: 'رد شده',
  implemented: 'اجرا شده',
};

export function SuggestionsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [addModal, setAddModal] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({ title: '', description: '', category: 'educational' });

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['suggestions'],
    queryFn: () => feedbackApi.getSuggestions(),
  });

  const addMutation = useMutation({
    mutationFn: () => feedbackApi.createSuggestion(form, user!.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suggestions'] });
      setAddModal(false);
      setForm({ title: '', description: '', category: 'educational' });
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: (id: number) => feedbackApi.upvoteSuggestion(id),
    onSuccess: (_, id) => {
      setUpvotedIds((prev) => new Set(prev).add(id));
      qc.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const topSuggestions = [...suggestions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => setAddModal(true)}>
          <Plus size={16} />
          ثبت پیشنهاد جدید
        </Button>
      </div>

      {/* Top suggestions */}
      {topSuggestions.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="section-title">پرطرفدارترین پیشنهادات</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topSuggestions.map((s, i) => (
              <div key={s.id} className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-500/10 dark:to-blue-500/10 rounded-xl border border-primary-100 dark:border-primary-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-black text-primary-200">#{i + 1}</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-primary-700 dark:text-primary-300">
                    <ThumbsUp size={14} />
                    {s.upvotes}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-slate-100 line-clamp-2">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All suggestions */}
      {isLoading ? (
        <LoadingSpinner />
      ) : suggestions.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="هنوز پیشنهادی ثبت نشده"
          description="اولین نفری باشید که پیشنهاد می‌دهد!"
          action={{ label: 'ثبت پیشنهاد', onClick: () => setAddModal(true) }}
        />
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => {
            const hasUpvoted = upvotedIds.has(s.id);
            return (
              <div key={s.id} className="card p-5">
                <div className="flex items-start gap-4">
                  {/* Upvote button */}
                  <button
                    onClick={() => !hasUpvoted && upvoteMutation.mutate(s.id)}
                    disabled={hasUpvoted}
                    className={`flex flex-col items-center gap-0.5 flex-shrink-0 p-2.5 rounded-xl border transition-all ${
                      hasUpvoted
                        ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-300'
                        : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    <span className="text-xs font-bold">{s.upvotes}</span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">{s.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {s.category && (
                          <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            {categoryLabels[s.category] ?? s.category}
                          </span>
                        )}
                        <Badge variant={s.status as 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented'} label={statusLabels[s.status]} />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 leading-relaxed">{s.description}</p>

                    {s.ai_summary && (
                      <div className="flex items-start gap-2 p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-100 mb-3">
                        <Sparkles size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-purple-700 dark:text-purple-300">{s.ai_summary}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {s.user && (
                          <span className="text-xs text-gray-400 dark:text-slate-500">{s.user.full_name}</span>
                        )}
                        <span className="text-xs text-gray-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-gray-400 dark:text-slate-500">{s.created_at.slice(0, 10)}</span>
                      </div>
                      {s.ai_priority_score !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 dark:text-slate-500">اولویت هوش مصنوعی:</span>
                          <span className={`text-xs font-bold ${
                            s.ai_priority_score > 0.8 ? 'text-green-600 dark:text-green-400' :
                            s.ai_priority_score > 0.6 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-slate-400'
                          }`}>
                            {Math.round(s.ai_priority_score * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="ثبت پیشنهاد جدید">
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
          <div>
            <label className="label">عنوان پیشنهاد *</label>
            <input
              className="input-field"
              placeholder="خلاصه پیشنهاد خود را بنویسید"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">دسته‌بندی</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {categoryOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">توضیحات *</label>
            <textarea
              className="input-field min-h-28 resize-none"
              placeholder="پیشنهاد خود را با جزئیات بیشتر توضیح دهید..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              loading={addMutation.isPending}
              className="flex-1 justify-center"
            >
              ثبت پیشنهاد
            </Button>
            <Button type="button" variant="secondary" onClick={() => setAddModal(false)}>
              انصراف
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

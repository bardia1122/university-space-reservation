import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Building2 } from 'lucide-react';
import { spacesApi } from '../../api/spaces';
import { SpaceCard } from '../../components/spaces/SpaceCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { spaceTypeLabels } from '../../lib/spaceVisuals';
import type { SpaceType } from '../../types';

const typeFilters: { value: SpaceType | ''; label: string }[] = [
  { value: '', label: 'همه فضاها' },
  ...(Object.keys(spaceTypeLabels) as SpaceType[]).map((value) => ({
    value,
    label: spaceTypeLabels[value],
  })),
];

export function SpacesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<SpaceType | ''>('');

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ['spaces', typeFilter],
    queryFn: () => spacesApi.getAll(typeFilter ? { space_type: typeFilter } : undefined),
  });

  const filtered = spaces.filter(
    (s) =>
      s.status === 'active' &&
      (search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="space-y-5">
      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input-field pr-10"
              placeholder="جستجوی فضا..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400 flex-shrink-0" />
            <select
              className="input-field py-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as SpaceType | '')}
            >
              {typeFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === f.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 px-1">
          {filtered.length} فضا یافت شد
        </p>
      )}

      {/* Spaces Grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="فضایی یافت نشد"
          description="با فیلترهای دیگر جستجو کنید"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}

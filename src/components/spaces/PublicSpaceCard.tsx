import { MapPin, Users, Star, CalendarPlus, Info, Settings } from 'lucide-react';
import { Badge } from '../common/Badge';
import { spaceTypeLabels, spaceTypeIcons, spaceImage } from '../../lib/spaceVisuals';
import type { Space } from '../../types';

interface PublicSpaceCardProps {
  space: Space;
  onReserve: (space: Space) => void;
  onInfo: (space: Space) => void;
  /** When the viewer is an admin, the primary action becomes "manage" instead of "reserve". */
  isAdmin?: boolean;
}

export function PublicSpaceCard({ space, onReserve, onInfo, isAdmin = false }: PublicSpaceCardProps) {
  const TypeIcon = spaceTypeIcons[space.space_type];
  const PrimaryIcon = isAdmin ? Settings : CalendarPlus;

  return (
    <div className="card overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={spaceImage(space)}
          alt={space.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={space.status} />
        </div>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
          <TypeIcon size={13} className="text-primary-600" />
          {spaceTypeLabels[space.space_type]}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{space.name}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{space.avg_rating.toFixed(1)}</span>
          </div>
        </div>

        {space.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{space.description}</p>
        )}

        <div className="space-y-1.5 mt-3 mb-4">
          {space.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={13} className="flex-shrink-0" />
              <span className="truncate">{space.location}</span>
            </div>
          )}
          {space.capacity && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={13} className="flex-shrink-0" />
              <span>ظرفیت: {space.capacity} نفر</span>
            </div>
          )}
        </div>

        {/* Two action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
          <button
            onClick={() => onReserve(space)}
            disabled={!isAdmin && space.status !== 'active'}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PrimaryIcon size={15} />
            {isAdmin ? 'مدیریت' : 'رزرو'}
          </button>
          <button
            onClick={() => onInfo(space)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Info size={15} />
            اطلاعات بیشتر
          </button>
        </div>
      </div>
    </div>
  );
}

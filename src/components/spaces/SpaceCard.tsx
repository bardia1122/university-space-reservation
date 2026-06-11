import { MapPin, Users, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { spaceTypeLabels, spaceTypeIcons, spaceImage } from '../../lib/spaceVisuals';
import type { Space } from '../../types';

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const navigate = useNavigate();
  const TypeIcon = spaceTypeIcons[space.space_type];

  return (
    <div
      className="card overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => navigate(`/spaces/${space.id}`)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
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
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
          {space.name}
        </h3>

        {space.description && (
          <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2">{space.description}</p>
        )}

        {/* Meta */}
        <div className="space-y-1.5">
          {space.location && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={13} className="flex-shrink-0" />
              <span>{space.location}</span>
            </div>
          )}
          {space.capacity && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={13} className="flex-shrink-0" />
              <span>ظرفیت: {space.capacity} نفر</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={13} className="flex-shrink-0" />
            <span>رزرو حداقل {space.min_advance_hours} ساعت قبل</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{space.avg_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({space.total_ratings})</span>
          </div>
          <span className="text-xs text-primary-600 font-medium group-hover:underline">
            مشاهده و رزرو
          </span>
        </div>
      </div>
    </div>
  );
}

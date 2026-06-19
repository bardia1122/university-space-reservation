import {
  Goal,
  Dumbbell,
  Theater,
  Presentation,
  Mic,
  Store,
  PartyPopper,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import type { Space, SpaceType } from '../types';

/** Persian labels for each space type. */
export const spaceTypeLabels: Record<SpaceType, string> = {
  football_field: 'زمین فوتبال',
  futsal_field: 'زمین فوتسال',
  cultural_plaza: 'پلاتوی فرهنگی',
  seminar_hall: 'سالن سمینار',
  conference_hall: 'سالن کنفرانس',
  exhibition_booth: 'غرفه نمایشگاهی',
  festival_booth: 'غرفه جشنواره',
};

/** Tailwind chip colours per space type. */
export const spaceTypeColors: Record<SpaceType, string> = {
  football_field: 'bg-green-50 text-green-700',
  futsal_field: 'bg-emerald-50 text-emerald-700',
  cultural_plaza: 'bg-purple-50 text-purple-700',
  seminar_hall: 'bg-blue-50 text-blue-700',
  conference_hall: 'bg-indigo-50 text-indigo-700',
  exhibition_booth: 'bg-cyan-50 text-cyan-700',
  festival_booth: 'bg-amber-50 text-amber-700',
};

/** Lucide icon per space type (replaces the old emoji set). */
export const spaceTypeIcons: Record<SpaceType, LucideIcon> = {
  football_field: Goal,
  futsal_field: Dumbbell,
  cultural_plaza: Theater,
  seminar_hall: Presentation,
  conference_hall: Mic,
  exhibition_booth: Store,
  festival_booth: PartyPopper,
};

export const fallbackSpaceIcon = Building2;

/** Resolve the illustration for a space: explicit image_url, else the per-type SVG. */
export function spaceImage(space: Pick<Space, 'image_url' | 'space_type'>): string {
  if (space.image_url) return space.image_url;
  return `/spaces/${space.space_type}.svg`;
}

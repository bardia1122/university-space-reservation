import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const sizes = { sm: 14, md: 18, lg: 24 };

export function StarRating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
}: StarRatingProps) {
  const px = sizes[size];
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={clsx(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          )}
        >
          <Star
            size={px}
            className={clsx(
              star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-600',
            )}
          />
        </button>
      ))}
    </div>
  );
}

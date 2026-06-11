import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="text-gray-400" size={26} />
        </div>
      )}
      <p className="text-gray-700 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-sm max-w-xs">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 btn-primary text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

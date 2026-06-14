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
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center dark:bg-slate-800">
          <Icon className="text-gray-400 dark:text-slate-500" size={26} />
        </div>
      )}
      <p className="text-gray-700 font-medium dark:text-slate-200">{title}</p>
      {description && <p className="text-gray-400 text-sm max-w-xs dark:text-slate-500">{description}</p>}
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

import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={clsx(
          'relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] animate-slide-in',
          {
            'max-w-sm': size === 'sm',
            'max-w-lg': size === 'md',
            'max-w-2xl': size === 'lg',
          },
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors dark:hover:text-slate-200 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

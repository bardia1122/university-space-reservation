import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ text = 'در حال بارگذاری...', fullPage }: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

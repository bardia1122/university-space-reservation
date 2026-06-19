import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere in the child tree and shows a friendly
 * fallback instead of unmounting the whole app to a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this is where you'd report to Sentry/LogRocket/etc.
    console.error('Uncaught render error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">مشکلی پیش آمد</h1>
        <p className="max-w-md text-sm text-gray-500 dark:text-slate-400">
          متأسفانه در نمایش این بخش خطایی رخ داد. می‌توانید دوباره تلاش کنید یا صفحه را بارگذاری
          مجدد کنید.
        </p>
        {import.meta.env.DEV && (
          <pre className="max-w-md overflow-auto rounded-lg bg-gray-100 p-3 text-left text-xs text-red-700 dark:bg-slate-800 dark:text-red-300">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3">
          <button onClick={this.reset} className="btn-secondary">
            <RotateCw size={16} />
            تلاش مجدد
          </button>
          <button onClick={() => window.location.reload()} className="btn-primary">
            بارگذاری مجدد صفحه
          </button>
        </div>
      </div>
    );
  }
}

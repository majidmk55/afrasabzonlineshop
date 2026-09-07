import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary — catches runtime errors in child components
 * and displays a user-friendly fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-6" dir="rtl">
          <div className="max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-ink">مشکلی پیش آمد</h2>
            <p className="mt-2 text-sm text-mist">
              متأسفانه خطایی در نمایش صفحه رخ داد. لطفاً صفحه را مجدداً بارگذاری کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-sea px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-seadeep"
            >
              بارگذاری مجدد
            </button>
            {this.state.error && (
              <details className="mt-4 text-right">
                <summary className="cursor-pointer text-xs text-mist">جزئیات خطا</summary>
                <pre className="mt-2 overflow-auto rounded bg-ink/5 p-3 text-left text-xs text-ink">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

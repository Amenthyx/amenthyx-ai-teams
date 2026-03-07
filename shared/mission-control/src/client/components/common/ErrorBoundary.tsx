import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <PanelErrorFallback error={this.state.error} onRetry={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

interface PanelErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
}

export const PanelErrorFallback: React.FC<PanelErrorFallbackProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border dark:border-red-900/50 border-red-200 dark:bg-red-950/20 bg-red-50 min-h-[120px]">
      <div className="text-red-500 text-sm font-medium mb-1">Panel Error</div>
      <div className="text-xs dark:text-gray-400 text-gray-500 mb-3 text-center max-w-sm">
        {error?.message || 'An unexpected error occurred'}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 bg-white hover:bg-gray-100 border dark:border-gray-600 border-gray-300 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

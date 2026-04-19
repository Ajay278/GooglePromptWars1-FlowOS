import { Component, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary — catches unexpected rendering crashes (e.g., service
 * downtime, corrupt state) and displays a high-contrast fallback UI instead of
 * a blank white screen. This is critical for production reliability.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production this would send to Sentry / Crashlytics
    console.error('[FlowOS ErrorBoundary] Uncaught error:', error);
    console.error('[FlowOS ErrorBoundary] Component stack:', info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center h-full bg-surface p-6 text-center gap-4"
        >
          <div className="bg-error-container p-4 rounded-full">
            <ShieldAlert className="text-error" size={40} />
          </div>
          <div>
            <h1 className="text-xl font-black text-on-surface mb-2">Service Temporarily Unavailable</h1>
            <p className="text-sm text-on-surface-variant max-w-xs">
              FlowOS is experiencing a connection or server error. Most features are running in safe mode.
              Please try refreshing.
            </p>
            {this.state.error && (
              <code className="block mt-3 text-xs text-error bg-error-container/40 rounded-lg px-3 py-2 text-left break-all">
                {this.state.error.message}
              </code>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl mt-2 active:scale-95 transition-transform"
            aria-label="Retry loading this section"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

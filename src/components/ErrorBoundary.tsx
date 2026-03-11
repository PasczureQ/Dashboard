import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="glass rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="text-destructive" size={28} />
            </div>
            <h2 className="text-xl font-display font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              className="btn-gradient px-6 py-3 text-sm text-primary-foreground"
            >
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

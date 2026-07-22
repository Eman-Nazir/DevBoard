import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6">
          <div className="text-center w-full max-w-sm sm:max-w-md">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg width="22" height="22" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-white font-semibold text-lg sm:text-xl mb-2">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-6 break-words px-2 sm:px-0">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
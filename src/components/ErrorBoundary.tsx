'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Handle error logging internally
    this.logError(error, errorInfo);
  }

  private logError(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // In production, you can send errors to monitoring services
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, DataDog, etc.
      // this.sendToErrorMonitoring(error, errorInfo);
    }
  }

  private sendToErrorMonitoring(error: Error, errorInfo: React.ErrorInfo): void {
    // Example implementation for error monitoring services
    try {
      // Sentry example:
      // Sentry.captureException(error, {
      //   contexts: {
      //     react: {
      //       componentStack: errorInfo.componentStack,
      //     },
      //   },
      // });

      // Or custom API endpoint:
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.message,
      //     stack: error.stack,
      //     componentStack: errorInfo.componentStack,
      //     url: window.location.href,
      //     userAgent: navigator.userAgent,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
    } catch (monitoringError) {
      // Fail silently if error monitoring fails
      console.error('Failed to send error to monitoring service:', monitoringError);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Oops! Terjadi Kesalahan
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Maaf atas ketidaknyamanannya. Terjadi kesalahan yang tidak terduga.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Detail Error:
              </h3>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-x-auto whitespace-pre-wrap">
                {error.message}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onReset}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Coba Lagi
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Muat Ulang Halaman
            </button>
          </div>

          {/* Contact Support */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            Jika masalah berlanjut, silakan hubungi support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary; 
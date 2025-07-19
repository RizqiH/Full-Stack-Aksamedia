import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'default' | 'primary' | 'light';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  text?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
} as const;

const variantClasses: Record<SpinnerVariant, string> = {
  default: 'border-gray-200 dark:border-gray-700 border-t-gray-600 dark:border-t-gray-300',
  primary: 'border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400',
  light: 'border-white/20 border-t-white',
} as const;

const textSizeClasses: Record<SpinnerSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const;

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className = '',
  text,
}: LoadingSpinnerProps): JSX.Element {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-4
          ${sizeClasses[size]}
          ${variantClasses[variant]}
        `}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={`mt-3 text-gray-600 dark:text-gray-400 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full-screen loading overlay
interface LoadingOverlayProps {
  text?: string;
  variant?: SpinnerVariant;
}

export function LoadingOverlay({ text = 'Loading...', variant = 'primary' }: LoadingOverlayProps): JSX.Element {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <LoadingSpinner size="lg" variant={variant} text={text} />
      </div>
    </div>
  );
}

// Inline loading state for content areas
interface LoadingStateProps {
  text?: string;
  size?: SpinnerSize;
}

export function LoadingState({ text = 'Loading content...', size = 'lg' }: LoadingStateProps): JSX.Element {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size={size} variant="primary" text={text} />
    </div>
  );
} 
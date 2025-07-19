import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent focus:ring-indigo-500 shadow-lg hover:shadow-xl',
  secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border-transparent focus:ring-gray-500',
  outline: 'bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500 shadow-lg hover:shadow-xl',
} as const;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const;

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-lg border-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'transform-none shadow-none' : 'hover:scale-[1.02]'}
        ${className}
      `}
    >
      {/* Loading spinner */}
      {loading && (
        <LoadingSpinner
          size="sm"
          variant="light"
          className="mr-2"
        />
      )}

      {/* Left icon */}
      {leftIcon && !loading && (
        <span className={`mr-2 ${iconSizeClasses[size]}`}>
          {leftIcon}
        </span>
      )}

      {/* Button text */}
      <span>{children}</span>

      {/* Right icon */}
      {rightIcon && !loading && (
        <span className={`ml-2 ${iconSizeClasses[size]}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
}

// Icon-only button variant
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon: ReactNode;
  'aria-label': string;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  const buttonSizeClasses: Record<ButtonSize, string> = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg border-2
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${buttonSizeClasses[size]}
        ${isDisabled ? 'transform-none shadow-none' : 'hover:scale-110'}
        ${className}
      `}
    >
      {loading ? (
        <LoadingSpinner size="sm" variant="light" />
      ) : (
        <span className={iconSizeClasses[size]}>
          {icon}
        </span>
      )}
    </button>
  );
} 
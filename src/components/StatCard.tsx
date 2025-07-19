import React, { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  isLoading?: boolean;
  error?: string | null;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-indigo-500',
  isLoading = false,
  error = null,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="card-hover p-6 rounded-xl">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-secondary">{title}</h3>
          
          {/* Loading State */}
          {isLoading && (
            <div className="mt-1 flex items-center">
              <LoadingSpinner size="sm" variant="primary" />
              <span className="ml-2 text-sm text-muted">Loading...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="mt-1">
              <p className="text-sm text-red-600 dark:text-red-400">Error loading data</p>
            </div>
          )}
          
          {/* Success State */}
          {!isLoading && !error && (
            <div className="mt-1">
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-primary">{value}</p>
                {trend && (
                  <span
                    className={`ml-2 text-sm font-medium ${
                      trend.isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted mt-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick stats icons
export const StatsIcons = {
  Users: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Building: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  TrendingUp: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Shield: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Clock: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Activity: (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
    </svg>
  ),
}; 
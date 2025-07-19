import { useState, useEffect } from 'react';
import apiService from '@/lib/api';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export interface DashboardStats {
  totalEmployees: number;
  totalDivisions: number;
  recentEmployees: number;
  systemUptime: string;
}

interface UseDashboardStatsResult {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error, setError, clearError } = useErrorHandler();

  const fetchStats = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      // Fetch employees and divisions in parallel
      const [employeesResponse, divisionsResponse] = await Promise.all([
        apiService.getEmployees({ page: 1, per_page: 1000 }), // Get all to count
        apiService.getDivisions(),
      ]);

      if (employeesResponse.status === 'success' && divisionsResponse.status === 'success') {
        const totalEmployees = employeesResponse.pagination?.total || 0;
        const totalDivisions = divisionsResponse.data?.divisions.length || 0;
        
        // Calculate recent employees (mock - could be enhanced with backend API)
        const recentEmployees = Math.floor(totalEmployees * 0.1); // 10% as recent
        
        // Mock system uptime
        const systemUptime = '99.9%';

        setStats({
          totalEmployees,
          totalDivisions,
          recentEmployees,
          systemUptime,
        });
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = async (): Promise<void> => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
} 
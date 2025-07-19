'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import StatCard, { StatsIcons } from '@/components/StatCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/Button';
import EmployeeAvatar from '@/components/EmployeeAvatar';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useEmployee } from '@/contexts/EmployeeContext';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { stats, isLoading, error, refreshStats } = useDashboardStats();
  const { employees, fetchEmployees } = useEmployee();

  // Get recent employees (latest 5)
  const recentEmployees = employees.slice(0, 5);

  useEffect(() => {
    // Fetch employees for recent list
    fetchEmployees();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([
      refreshStats(),
      fetchEmployees(),
    ]);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen dashboard-gradient">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left animate-slide-in">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  Dashboard Overview
                </h1>
                <p className="text-secondary text-lg max-w-2xl">
                  Monitor dan kelola data karyawan dengan real-time statistics
                </p>
                  </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={handleRefresh}
                  loading={isLoading}
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                  variant="outline"
                >
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Karyawan"
                value={stats?.totalEmployees ?? 0}
                icon={StatsIcons.Users}
                iconBgColor="bg-indigo-500"
                isLoading={isLoading}
                error={error}
                subtitle="Active employees"
              />

              <StatCard
                title="Total Divisi"
                value={stats?.totalDivisions ?? 0}
                icon={StatsIcons.Building}
                iconBgColor="bg-green-500"
                isLoading={isLoading}
                error={error}
                subtitle="Active departments"
              />

              <StatCard
                title="Karyawan Baru"
                value={stats?.recentEmployees ?? 0}
                icon={StatsIcons.TrendingUp}
                iconBgColor="bg-blue-500"
                isLoading={isLoading}
                error={error}
                subtitle="This month"
                trend={{ value: 12, isPositive: true }}
              />

              <StatCard
                title="System Uptime"
                value={stats?.systemUptime ?? '99.9%'}
                icon={StatsIcons.Shield}
                iconBgColor="bg-purple-500"
                isLoading={isLoading}
                error={error}
                subtitle="Last 30 days"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Employees */}
              <div className="lg:col-span-2">
                <div className="card-hover p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary">Karyawan Terbaru</h2>
                    <Link href="/data">
                      <Button variant="ghost" size="sm">
                        Lihat Semua
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      </Button>
                    </Link>
                  </div>

                  {recentEmployees.length > 0 ? (
                    <div className="space-y-3">
                      {recentEmployees.map((employee) => (
                        <div key={employee.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <EmployeeAvatar 
                            src={employee.image} 
                            name={employee.name} 
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary truncate">
                              {employee.name}
                            </p>
                            <p className="text-sm text-secondary truncate">
                              {employee.division.name} • {employee.position}
                            </p>
                          </div>
                          <div className="text-xs text-muted">
                            {employee.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        {StatsIcons.Users}
                      </div>
                      <p className="text-muted">Belum ada data karyawan</p>
                      <Link href="/data/create">
                        <Button 
                          className="mt-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.05] transition-all duration-300 px-6 py-3" 
                          size="md"
                          leftIcon={
                            <div className="p-1 bg-white/20 rounded-full animate-pulse">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                  </div>
                          }
                        >
                          Tambah Karyawan Pertama
                        </Button>
                      </Link>
                </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <div className="card-hover p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/data/create">
                      <Button 
                        fullWidth 
                        variant="primary" 
                        size="md" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className="p-1 bg-white/20 rounded-full">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <span>Tambah Karyawan</span>
                        </div>
                      </Button>
                    </Link>
                    
                    <Link href="/data">
                      <Button 
                        fullWidth 
                        variant="outline" 
                        size="md" 
                        className="border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <div className="p-1 bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 rounded-full transition-colors duration-200">
                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <span className="font-medium">Kelola Data</span>
                        </div>
                      </Button>
                    </Link>

                    <Link href="/profile">
                      <Button 
                        fullWidth 
                        variant="ghost" 
                        size="md" 
                        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <div className="p-1 bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 rounded-full transition-colors duration-200">
                            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                          <span className="font-medium">Edit Profile</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* System Status */}
                <div className="card-hover p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-primary mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary">API Status</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        Online
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary">Database</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        Connected
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary">Last Backup</span>
                      <span className="text-xs text-muted">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="card-hover p-6 rounded-xl border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Data Loading Error
                      </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

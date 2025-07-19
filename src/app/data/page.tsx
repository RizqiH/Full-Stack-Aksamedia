'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Pagination from '@/components/Pagination';
import EmployeeAvatar from '@/components/EmployeeAvatar';
import { useEmployee } from '@/contexts/EmployeeContext';

export default function DataPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    employees,
    divisions,
    currentPage,
    totalPages,
    searchTerm,
    selectedDivision,
    isLoading,
    error,
    deleteEmployee,
    setSearchTerm,
    setCurrentPage,
    setSelectedDivision,
    clearError,
  } = useEmployee();

  // Load state from URL parameters on mount
  useEffect(() => {
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const division = searchParams.get('division');

    if (page) setCurrentPage(parseInt(page));
    if (search) setSearchTerm(search);
    if (division) setSelectedDivision(division);
  }, [searchParams, setCurrentPage, setSearchTerm, setSelectedDivision]);

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDivision) params.set('division', selectedDivision);

    const url = params.toString() ? `/data?${params.toString()}` : '/data';
    router.replace(url, { scroll: false });
  }, [currentPage, searchTerm, selectedDivision, router]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const success = await deleteEmployee(id);
      if (!success && error) {
        alert(`Failed to delete employee: ${error}`);
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setCurrentPage(1); // Reset to first page when changing division
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen dashboard-gradient">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    Manajemen Karyawan
                  </h1>
                  <p className="mt-2 text-secondary">
                    Kelola data karyawan dengan fitur CRUD lengkap, pencarian, dan paginasi.
                  </p>
                </div>
                <Link href="/data/create">
                  <button className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center space-x-3">
                      <div className="p-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="text-base">Tambah Karyawan</span>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 -left-full group-hover:left-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-out skew-x-12"></div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                  <button
                    onClick={clearError}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="form-input-override w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>  
                <div>
                  <select
                    className="form-select-override mobile-select-dropdown w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                  >
                    <option value="">
                      All Divisions
                    </option>
                    {divisions.map((division) => (
                      <option 
                        key={division.id} 
                        value={division.id}
                      >
                        {division.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : employees.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <div className="max-w-sm mx-auto">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m0 0V4a1 1 0 011-1h6a1 1 0 011 1v1" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-foreground">No employees found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating a new employee.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/data/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Employee
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Photo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Division
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Position
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {employees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <EmployeeAvatar 
                              src={employee.image} 
                              name={employee.name} 
                              size="md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {employee.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {employee.division.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {employee.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/data/${employee.id}`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                            >
                              View
                            </Link>
                            <Link
                              href={`/data/${employee.id}/edit`}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden">
                  <div className="space-y-4 p-4">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <EmployeeAvatar 
                              src={employee.image} 
                              name={employee.name} 
                              size="md"
                            />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {employee.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                          Phone: {employee.phone}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                          Division: {employee.division.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                          Position: {employee.position}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/data/${employee.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            View
                          </Link>
                          <Link
                            href={`/data/${employee.id}/edit`}
                            className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && employees.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
        
        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Link href="/data/create">
            <button className="group w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="relative w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}

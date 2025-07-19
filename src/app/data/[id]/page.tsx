'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import EmployeeAvatar from '@/components/EmployeeAvatar';
import { useEmployee } from '@/contexts/EmployeeContext';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getEmployee, deleteEmployee, isLoading, error } = useEmployee();

  const id = params.id as string;
  const employee = getEmployee(id);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const success = await deleteEmployee(id);
      if (success) {
        router.push('/data');
      }
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-sm text-muted-foreground">Loading employee...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!employee) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Employee Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                  The employee you are looking for does not exist.
                </p>
                <Link
                  href="/data"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Back to Employees
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <nav className="flex mb-2" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                      <li className="inline-flex items-center">
                        <Link
                          href="/data"
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          Employee Management
                        </Link>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <svg
                            className="w-6 h-6 text-muted-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-1 text-muted-foreground">
                            Employee Details
                          </span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                  <h1 className="text-2xl font-bold text-foreground">
                    {employee.name}
                  </h1>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/data/${employee.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-foreground">
                                      Employee Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                                          Detailed information about this employee.
                </p>
              </div>
              <div className="border-t border-border">
                <dl>
                  <div className="bg-muted/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Profile Photo
                    </dt>
                    <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      <EmployeeAvatar 
                        src={employee.image} 
                        name={employee.name} 
                        size="xl"
                      />
                    </dd>
                  </div>
                  <div className="bg-background px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Name
                    </dt>
                    <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {employee.name}
                    </dd>
                  </div>
                  <div className="bg-muted/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      <a
                        href={`tel:${employee.phone}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {employee.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="bg-background px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Division
                    </dt>
                    <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {employee.division.name}
                    </dd>
                  </div>
                  <div className="bg-muted/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Position
                    </dt>
                    <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                      {employee.position}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/data"
                className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Employee List
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useEmployee } from '@/contexts/EmployeeContext';

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const { getEmployee, updateEmployee, divisions, isLoading: contextLoading, error } = useEmployee();

  const id = params.id as string;
  const employee = getEmployee(id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    division: '',
    position: '',
    image: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        phone: employee.phone,
        division: employee.division.id,
        position: employee.position,
        image: null, // Reset image as we can't pre-populate file input
      });
    }
    setIsLoading(false);
  }, [employee]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\+\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.division.trim()) {
      newErrors.division = 'Division is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Image validation if present
    if (formData.image) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(formData.image.type)) {
        newErrors.image = 'Please select a valid image file (JPEG, PNG, JPG, GIF)';
      }
      if (formData.image.size > 2 * 1024 * 1024) { // 2MB limit
        newErrors.image = 'Image file size must be less than 2MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await updateEmployee(id, {
        name: formData.name,
        phone: formData.phone,
        division: formData.division,
        position: formData.position,
        image: formData.image || undefined,
      });

      if (success) {
        router.push(`/data/${id}`);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));

    // Clear error when user selects a file
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
                  The employee you are trying to edit does not exist.
                </p>
                <Link
                  href="/data"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Back to Data
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
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link
                      href="/data"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      Data Management
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
                      <Link
                        href={`/data/${id}`}
                        className="ml-1 text-foreground hover:text-primary transition-colors"
                      >
                        {employee.name}
                      </Link>
                    </div>
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
                      <span className="ml-1 text-muted-foreground">Edit</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-foreground">
                Edit {employee.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the information for this employee.
              </p>
            </div>

            <div className="max-w-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-background border border-border shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-1 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-foreground">
                        Employee Information
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Update the details for this employee.
                      </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-input-override mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200 ${
                              errors.name
                                ? 'border-red-500 dark:border-red-400'
                                : ''
                            }`}
                            placeholder="Enter full name"
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {errors.name}
                            </p>
                          )}
                        </div>



                        <div className="col-span-6">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`form-input-override mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200 ${
                              errors.phone
                                ? 'border-red-500 dark:border-red-400'
                                : ''
                            }`}
                            placeholder="Enter phone number"
                          />
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="position"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Position *
                          </label>
                          <input
                            type="text"
                            name="position"
                            id="position"
                            value={formData.position}
                            onChange={handleChange}
                            className={`form-input-override mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200 ${
                              errors.position
                                ? 'border-red-500 dark:border-red-400'
                                : ''
                            }`}
                            placeholder="Enter position"
                          />
                          {errors.position && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {errors.position}
                            </p>
                          )}
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="division"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Division *
                          </label>
                          <select
                            name="division"
                            id="division"
                            value={formData.division}
                            onChange={handleChange}
                            className={`form-select-override mobile-select-dropdown mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200 ${
                              errors.division
                                ? 'border-red-500 dark:border-red-400'
                                : ''
                            }`}
                          >
                            <option value="">Select Division</option>
                            {divisions.map((division) => (
                              <option 
                                key={division.id} 
                                value={division.id}
                              >
                                {division.name}
                              </option>
                            ))}
                          </select>
                          {errors.division && (
                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                              {errors.division}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/data/${id}`}
                    className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Updating...
                      </>
                    ) : (
                                              'Update Employee'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

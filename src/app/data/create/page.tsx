'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

import { useEmployee } from '@/contexts/EmployeeContext';
import apiService from '@/lib/api';
import { Division, EmployeeCreateRequest } from '@/lib/api';

export default function CreateEmployeePage() {
  const router = useRouter();
  const { createEmployee } = useEmployee();

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(true);

  const [formData, setFormData] = useState<EmployeeCreateRequest>({
    name: '',
    phone: '',
    division: '',
    position: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        setIsLoadingDivisions(true);
        const response = await apiService.getDivisions();
        if (response.status === 'success' && response.data) {
          setDivisions(response.data.divisions);
        } else {
          setErrors({ division: 'Failed to load divisions' });
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
        setErrors({ division: 'Failed to load divisions' });
      } finally {
        setIsLoadingDivisions(false);
      }
    };

    fetchDivisions();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama karyawan wajib diisi';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^[\d\+\-\s\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.division) {
      newErrors.division = 'Divisi wajib dipilih';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Posisi/jabatan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = { ...formData };
      if (selectedImage) {
        submitData.image = selectedImage;
      }

      await createEmployee(submitData);
      router.push('/data');
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrors({ submit: 'Gagal membuat karyawan. Silakan coba lagi.' });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'File harus berupa gambar' }));
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Ukuran file maksimal 2MB' }));
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen dashboard-gradient flex flex-col">
        <Navbar />
        
        <main className="flex-1 max-w-4xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 w-full overflow-y-auto mobile-scroll-fix">
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link
                      href="/data"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base"
                    >
                      Data Karyawan
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-1 text-gray-500 dark:text-gray-400 text-sm sm:text-base">Tambah Karyawan</span>
                    </div>
                  </li>
                </ol>
              </nav>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tambah Karyawan Baru</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Isi formulir di bawah untuk menambah karyawan baru
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto Profil (Opsional)
                  </label>
                  
                  {imagePreview ? (
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Foto berhasil dipilih</p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                          Hapus foto
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                      <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-3 sm:mt-4">
                        <label htmlFor="image" className="cursor-pointer">
                          <span className="mt-1 sm:mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Klik untuk upload foto
                          </span>
                          <span className="mt-1 block text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF hingga 2MB
                          </span>
                          </label>
                          <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </div>
                    </div>
                  )}
                  
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                          )}
                        </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap *
                          </label>
                          <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                            onChange={handleChange}
                    className="form-input-override w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Masukkan nama lengkap karyawan"
                          />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                          )}
                        </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nomor Telepon *
                          </label>
                          <input
                    id="phone"
                    name="phone"
                            type="tel"
                    required
                            value={formData.phone}
                            onChange={handleChange}
                    className="form-input-override w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Contoh: +62 812 3456 7890"
                          />
                          {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                          )}
                        </div>

                {/* Division */}
                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Divisi *
                  </label>
                  {isLoadingDivisions ? (
                    <div className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Memuat divisi...</span>
                    </div>
                  ) : (
                    <select
                      id="division"
                      name="division"
                      required
                      value={formData.division}
                      onChange={handleChange}
                      className="form-select-override mobile-select-dropdown w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    >
                      <option value="">
                        Pilih divisi
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
                  )}
                  {errors.division && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.division}</p>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posisi/Jabatan *
                          </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    required
                    value={formData.position}
                            onChange={handleChange}
                    className="form-input-override w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Contoh: Frontend Developer, Marketing Manager"
                          />
                  {errors.position && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.position}</p>
                          )}
                        </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-red-800 dark:text-red-300">{errors.submit}</span>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/data" className="w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                      Batal
                    </button>
                  </Link>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoadingDivisions}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Simpan Karyawan
                      </>
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

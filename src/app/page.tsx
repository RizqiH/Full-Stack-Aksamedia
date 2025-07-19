'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage(): JSX.Element {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while authentication is being checked
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" variant="primary" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Aksamedia
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mempersiapkan pengalaman Anda...
          </p>
        </div>
      </div>
    </div>
  );
}

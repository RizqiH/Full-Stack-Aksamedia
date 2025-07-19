import { useState, useCallback } from 'react';

interface UseErrorHandlerResult {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}

/**
 * Custom hook for consistent error handling across the application
 */
export function useErrorHandler(): UseErrorHandlerResult {
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((error: string | null) => {
    setErrorState(error);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setErrorState(error.message);
    } else if (typeof error === 'string') {
      setErrorState(error);
    } else if (error && typeof error === 'object' && 'message' in error) {
      setErrorState((error as { message: string }).message);
    } else {
      setErrorState('An unexpected error occurred');
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleError,
  };
} 
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import apiService, { 
  Employee, 
  Division, 
  EmployeeCreateRequest, 
  EmployeeUpdateRequest,
  EmployeeSearchParams
} from '@/lib/api';

interface EmployeeContextType {
  employees: Employee[];
  divisions: Division[];
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  selectedDivision: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchEmployees: () => Promise<void>;
  fetchDivisions: () => Promise<void>;
  createEmployee: (employee: EmployeeCreateRequest) => Promise<boolean>;
  updateEmployee: (id: string, employee: EmployeeUpdateRequest) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  
  // Filters
  setSearchTerm: (term: string) => void;
  setSelectedDivision: (divisionId: string) => void;
  setCurrentPage: (page: number) => void;
  
  // Utilities
  getEmployee: (id: string) => Employee | undefined;
  clearError: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees with filters
  const fetchEmployees = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: EmployeeSearchParams = { page: currentPage };
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      if (selectedDivision) {
        params.division_id = selectedDivision;
      }
      
      const response = await apiService.getEmployees(params);
      
      if (response.status === 'success' && response.data) {
        setEmployees(response.data.employees);
        if (response.pagination) {
          setTotalPages(response.pagination.last_page);
        }
      } else {
        setError(response.message || 'Failed to fetch employees');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch divisions
  const fetchDivisions = async (): Promise<void> => {
    try {
      const response = await apiService.getDivisions();
      if (response.status === 'success' && response.data) {
        setDivisions(response.data.divisions);
      } else {
        setError(response.message || 'Failed to fetch divisions');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch divisions';
      setError(errorMessage);
    }
  };

  // Create employee
  const createEmployee = async (employee: EmployeeCreateRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.createEmployee(employee);
      
      if (response.status === 'success') {
        await fetchEmployees(); // Refresh list
        return true;
      } else {
        setError(response.message || 'Failed to create employee');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update employee
  const updateEmployee = async (id: string, employee: EmployeeUpdateRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.updateEmployee(id, employee);
      
      if (response.status === 'success') {
        await fetchEmployees(); // Refresh list
        return true;
      } else {
        setError(response.message || 'Failed to update employee');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete employee
  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.deleteEmployee(id);
      
      if (response.status === 'success') {
        await fetchEmployees(); // Refresh list
        return true;
      } else {
        setError(response.message || 'Failed to delete employee');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(employee => employee.id === id);
  };

  const clearError = (): void => {
    setError(null);
  };

  // Auto-fetch employees when filters change
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm, selectedDivision]);

  // Fetch divisions on mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  const contextValue: EmployeeContextType = {
    employees,
    divisions,
    currentPage,
    totalPages,
    searchTerm,
    selectedDivision,
    isLoading,
    error,
    fetchEmployees,
    fetchDivisions,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setSearchTerm,
    setSelectedDivision,
    setCurrentPage,
    getEmployee,
    clearError,
  };

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee(): EmployeeContextType {
  const context = useContext(EmployeeContext);
  
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  
  return context;
} 
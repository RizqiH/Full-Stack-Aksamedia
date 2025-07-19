// API Service Layer untuk integrasi dengan backend Laravel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-rizkiamanan.wasmer.app/api';

// Types berdasarkan backend API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    token: string;
    admin: {
      id: string;
      name: string;
      username: string;
      phone: string;
      email: string;
    };
  };
}

export interface Division {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  image?: string;
  name: string;
  phone: string;
  division: {
    id: string;
    name: string;
  };
  position: string;
}

export interface EmployeeCreateRequest {
  name: string;
  phone: string;
  division: string; // UUID
  position: string;
  image?: File;
}

export interface EmployeeUpdateRequest {
  name: string;
  phone: string;
  division: string; // UUID
  position: string;
  image?: File;
}

export interface EmployeeSearchParams {
  page?: number;
  name?: string;
  division_id?: string;
  per_page?: number;
}

export interface EmployeeResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    employees: Employee[];
  };
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    next_page_url?: string;
    prev_page_url?: string;
  };
}

export interface DivisionResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    divisions: Division[];
  };
}

export interface ApiResponse<TData = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: TData;
  errors?: Record<string, string[]>;
}

class ApiService {
  private readonly baseUrl = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    // Load token dari localStorage pada initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  // Set authentication token
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Get authentication headers
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Get headers for FormData requests (without Content-Type)
  private getFormDataHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    try {
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Invalid response format. Response: ${text.substring(0, 200)}`);
      }

      const data = await response.json() as T;

      if (!response.ok) {
        console.error('API Error:', { status: response.status, data });
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        Object.assign(error, { status: response.status, data });
        throw error;
      }

      return data;
    } catch (e) {
      if (e instanceof SyntaxError) {
        const text = await response.text();
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid JSON response from server');
      }
      throw e;
    }
  }

  // Login method - Token-based authentication (stateless)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(credentials),
    });

    const result = await this.handleResponse<LoginResponse>(response);
    
    if (result.status === 'success' && result.data?.token) {
      this.setToken(result.data.token);
    }

    return result;
  }

  // Logout method
  async logout(): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    const result = await this.handleResponse<ApiResponse>(response);
    
    if (result.status === 'success') {
      this.setToken(null);
    }

    return result;
  }

  // Get employees with filters
  async getEmployees(params: EmployeeSearchParams = {}): Promise<EmployeeResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const url = `${this.baseUrl}/employees${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<EmployeeResponse>(response);
  }

  // Create employee
  async createEmployee(employee: EmployeeCreateRequest): Promise<ApiResponse<{ employee_id: string }>> {
    const formData = new FormData();
    
    formData.append('name', employee.name);
    formData.append('phone', employee.phone);
    formData.append('division', employee.division);
    formData.append('position', employee.position);
    
    if (employee.image) {
      formData.append('image', employee.image);
    }

    const response = await fetch(`${this.baseUrl}/employees`, {
      method: 'POST',
      headers: this.getFormDataHeaders(),
      body: formData,
    });

    return this.handleResponse<ApiResponse<{ employee_id: string }>>(response);
  }

  // Update employee
  async updateEmployee(id: string, employee: EmployeeUpdateRequest): Promise<ApiResponse<Employee>> {
    const formData = new FormData();
    
    formData.append('name', employee.name);
    formData.append('phone', employee.phone);
    formData.append('division', employee.division);
    formData.append('position', employee.position);
    formData.append('_method', 'PUT');
    
    if (employee.image) {
      formData.append('image', employee.image);
    }

    const response = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'POST', // Laravel expects POST with _method=PUT for file uploads
      headers: this.getFormDataHeaders(),
      body: formData,
    });

    return this.handleResponse<ApiResponse<Employee>>(response);
  }

  // Delete employee
  async deleteEmployee(id: string): Promise<ApiResponse> {
    const response = await fetch(`${this.baseUrl}/employees/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ApiResponse>(response);
  }

  // Get divisions
  async getDivisions(): Promise<DivisionResponse> {
    const response = await fetch(`${this.baseUrl}/divisions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<DivisionResponse>(response);
  }
}

const apiService = new ApiService();
export default apiService; 
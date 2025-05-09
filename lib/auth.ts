import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  name: string;
  // Add other user fields as needed
}

// Create an axios instance with authorization header
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add interceptor to refresh token on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Get new access token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        // Store new access token
        localStorage.setItem('accessToken', response.data.access);
        
        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Login user and get tokens
export async function loginUser(credentials: LoginCredentials): Promise<AuthTokens> {
  try {
    const response = await axios.post(`${API_URL}/token/`, {
      email: credentials.username,
      password: credentials.password,
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response.data.detail || 'Authentication failed');
    }
    throw new Error('Unable to connect to server');
  }
}

// Get current user information
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get('/users/me/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
}

// Logout user
export function logoutUser(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
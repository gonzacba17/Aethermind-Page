import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  plan?: 'free' | 'pro' | 'enterprise';
  subscription?: {
    status: 'active' | 'inactive' | 'canceled';
    plan: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aethermindapi-production.up.railway.app/api';

export const authAPI = {
  /**
   * Register a new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Login existing user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Logout user
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Initiate Google OAuth
   */
  loginWithGoogle() {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(callbackUrl)}`;
  },

  /**
   * Initiate GitHub OAuth
   */
  loginWithGitHub() {
    const callbackUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${API_BASE_URL}/auth/github?redirect=${encodeURIComponent(callbackUrl)}`;
  },

  /**
   * Check if user has active membership
   */
  hasActiveMembership(user: User): boolean {
    // Check if plan is not free
    if (user.plan && user.plan !== 'free') {
      return true;
    }

    // Check subscription status
    if (user.subscription && user.subscription.status === 'active') {
      return true;
    }

    return false;
  },
};

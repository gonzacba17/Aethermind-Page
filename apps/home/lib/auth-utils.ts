import { User, authAPI } from './api/auth';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://aethermind-agent-os-dashboard.vercel.app';

/**
 * Save JWT token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Smart redirect after authentication
 * - If user has no membership → /pricing
 * - If user has active membership → Dashboard
 */
export async function redirectAfterAuth(user?: User): Promise<void> {
  try {
    // If user not provided, fetch from API
    if (!user) {
      user = await authAPI.getCurrentUser();
    }

    // Check if user has active membership
    const hasMembership = authAPI.hasActiveMembership(user);

    if (hasMembership) {
      // Has membership → Redirect to dashboard
      window.location.href = `${DASHBOARD_URL}/dashboard`;
    } else {
      // No membership → Redirect to pricing page
      window.location.href = '/pricing?checkout=true';
    }
  } catch (error) {
    console.error('Error during redirect:', error);
    // Fallback: redirect to pricing
    window.location.href = '/pricing';
  }
}

/**
 * Redirect to dashboard directly
 */
export function redirectToDashboard(): void {
  window.location.href = `${DASHBOARD_URL}/dashboard`;
}

/**
 * Redirect to pricing page
 */
export function redirectToPricing(checkout = false): void {
  const url = checkout ? '/pricing?checkout=true' : '/pricing';
  window.location.href = url;
}

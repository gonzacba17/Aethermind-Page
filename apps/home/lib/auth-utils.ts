import { User } from './api/auth';
import { config } from './config';

/**
 * Save authentication token to storage
 * @param token JWT token from backend
 * @param rememberMe Whether to use persistent storage (localStorage) or session storage
 */
export function saveToken(token: string, rememberMe = false) {
  if (typeof window === 'undefined') return;

  if (rememberMe) {
    // Persistent storage - survives browser close
    localStorage.setItem('token', token);
    localStorage.setItem('rememberMe', 'true');
  } else {
    // Session storage - cleared when browser closes
    sessionStorage.setItem('token', token);
    localStorage.removeItem('rememberMe');
  }
}

/**
 * Get authentication token from storage
 * Checks both localStorage (persistent) and sessionStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Check if user had "remember me" enabled
  const rememberMe = localStorage.getItem('rememberMe') === 'true';

  if (rememberMe) {
    return localStorage.getItem('token');
  } else {
    // Check session storage first, fallback to localStorage
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }
}

/**
 * Remove authentication token from all storage
 */
export function removeToken() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');
  localStorage.removeItem('rememberMe');
  sessionStorage.removeItem('token');
}

/**
 * Check if Remember Me is enabled
 */
export function isRememberMeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('rememberMe') === 'true';
}

/**
 * Redirect user after successful authentication
 * Smart redirect based on membership status
 * @param user Optional user object to check membership
 */
export async function redirectAfterAuth(user?: User) {
  if (typeof window === 'undefined') return;

  try {
    // If no user provided, try to fetch from API
    if (!user) {
      const token = getToken();
      if (!token) {
        window.location.href = '/pricing?checkout=true';
        return;
      }

      // Fetch user info to check membership
      const response = await fetch(`${config.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        window.location.href = '/pricing?checkout=true';
        return;
      }

      user = await response.json();
    }

    // Check if user has active membership
    const hasActiveMembership = user && (
      (user.plan && user.plan !== 'free') ||
      (user.subscription && user.subscription.status === 'active')
    );

    if (hasActiveMembership) {
      // User has membership, redirect to dashboard
      window.location.href = `${config.dashboardUrl}/dashboard`;
    } else {
      // User doesn't have membership, redirect to pricing
      window.location.href = '/pricing?checkout=true';
    }
  } catch (error) {
    console.error('Error during redirect:', error);
    // Fallback to pricing page on error
    window.location.href = '/pricing';
  }
}

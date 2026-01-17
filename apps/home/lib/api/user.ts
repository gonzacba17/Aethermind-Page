import { apiClient, ApiError } from './client';
import { getToken } from '@/lib/auth-utils';
import { config } from '@/lib/config';

/**
 * User plan types
 */
export type PlanType = 'free' | 'pro' | 'enterprise';

/**
 * Response from plan update
 */
export interface PlanUpdateResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    plan: PlanType;
  };
  message?: string;
}

/**
 * Validation result before plan update
 */
export interface UserValidationResult {
  valid: boolean;
  reason?: 'NO_TOKEN' | 'INVALID_TOKEN' | 'TEMP_USER' | 'ALREADY_HAS_PLAN' | 'API_ERROR';
  user?: {
    id: string;
    email: string;
    name?: string;
    plan?: PlanType;
  };
  message?: string;
}

/**
 * Error messages in Spanish for user-facing display
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  NO_TOKEN: 'No has iniciado sesión. Por favor inicia sesión para continuar.',
  INVALID_TOKEN: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  
  // User state errors
  TEMP_USER: 'Tu cuenta es temporal. Recarga la página para completar el registro con Google.',
  ALREADY_FREE: 'Ya tienes el plan Free activo.',
  ALREADY_PRO: 'Ya tienes el plan Pro activo.',
  
  // Network/Server errors
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente en unos minutos.',
  TIMEOUT: 'La solicitud tardó demasiado. Intenta nuevamente.',
  
  // Generic
  UNKNOWN: 'Ocurrió un error inesperado. Intenta nuevamente.',
};

/**
 * Get user-friendly error message based on error code or message
 */
export function getErrorMessage(error: ApiError | Error | unknown): string {
  if (!error) return ERROR_MESSAGES.UNKNOWN;
  
  // Handle ApiError with code
  if ((error as ApiError).code) {
    const apiError = error as ApiError;
    switch (apiError.code) {
      case 'AUTH_ERROR':
        return ERROR_MESSAGES.INVALID_TOKEN;
      case 'TEMP_USER_ERROR':
        return ERROR_MESSAGES.TEMP_USER;
      case 'NETWORK_ERROR':
        return ERROR_MESSAGES.NETWORK_ERROR;
      case 'SERVER_ERROR':
        return ERROR_MESSAGES.SERVER_ERROR;
      case 'TIMEOUT':
        return ERROR_MESSAGES.TIMEOUT;
      default:
        return apiError.message || ERROR_MESSAGES.UNKNOWN;
    }
  }
  
  // Handle regular Error
  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.UNKNOWN;
  }
  
  return ERROR_MESSAGES.UNKNOWN;
}

/**
 * Check if a user ID indicates a temporary user
 */
export function isTemporaryUser(userId: string): boolean {
  return userId.startsWith('temp-') || userId.startsWith('tmp-');
}

/**
 * User API functions
 */
export const userAPI = {
  /**
   * Validate user before allowing plan update
   * Checks: token exists, token valid, user not temporary
   */
  async validateForPlanUpdate(targetPlan: PlanType = 'free'): Promise<UserValidationResult> {
    console.log('[userAPI] Validating user for plan update:', targetPlan);
    
    // 1. Check if token exists
    const token = getToken();
    if (!token) {
      console.log('[userAPI] No token found');
      return {
        valid: false,
        reason: 'NO_TOKEN',
        message: ERROR_MESSAGES.NO_TOKEN,
      };
    }
    
    try {
      // 2. Fetch current user to validate token and get user data
      console.log('[userAPI] Fetching current user...');
      const response = await fetch(`${config.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.log('[userAPI] Token invalid, status:', response.status);
        return {
          valid: false,
          reason: 'INVALID_TOKEN',
          message: ERROR_MESSAGES.INVALID_TOKEN,
        };
      }
      
      const user = await response.json();
      console.log('[userAPI] User fetched:', { id: user.id, email: user.email, plan: user.plan });
      
      // 3. Check if user is temporary
      if (isTemporaryUser(user.id)) {
        console.log('[userAPI] User is temporary');
        return {
          valid: false,
          reason: 'TEMP_USER',
          user,
          message: ERROR_MESSAGES.TEMP_USER,
        };
      }
      
      // 4. Check if user already has the target plan
      if (user.plan === targetPlan) {
        console.log('[userAPI] User already has plan:', targetPlan);
        const planName = targetPlan.charAt(0).toUpperCase() + targetPlan.slice(1);
        return {
          valid: false,
          reason: 'ALREADY_HAS_PLAN',
          user,
          message: `Ya tienes el plan ${planName} activo.`,
        };
      }
      
      // All checks passed
      console.log('[userAPI] Validation passed');
      return {
        valid: true,
        user,
      };
    } catch (error) {
      console.error('[userAPI] Validation error:', error);
      return {
        valid: false,
        reason: 'API_ERROR',
        message: getErrorMessage(error),
      };
    }
  },
  
  /**
   * Update user's plan
   */
  async updatePlan(plan: PlanType): Promise<PlanUpdateResponse> {
    console.log('[userAPI] Updating plan to:', plan);
    
    const token = getToken();
    if (!token) {
      throw new Error(ERROR_MESSAGES.NO_TOKEN);
    }
    
    const response = await fetch(`${config.apiUrl}/auth/update-plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('[userAPI] Update plan failed:', response.status, data);
      
      // Create appropriate error message
      let message = data.message || data.error || ERROR_MESSAGES.UNKNOWN;
      
      if (response.status === 401) {
        message = ERROR_MESSAGES.INVALID_TOKEN;
      } else if (response.status === 400) {
        // Check for temporary user error in response
        const lowerMessage = (data.message || data.error || '').toLowerCase();
        if (lowerMessage.includes('temp') || lowerMessage.includes('temporary')) {
          message = ERROR_MESSAGES.TEMP_USER;
        }
      } else if (response.status >= 500) {
        message = ERROR_MESSAGES.SERVER_ERROR;
      }
      
      throw new Error(message);
    }
    
    console.log('[userAPI] Plan updated successfully:', data);
    return data as PlanUpdateResponse;
  },
};

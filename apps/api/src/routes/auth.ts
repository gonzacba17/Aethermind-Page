import { Router, Request, Response } from 'express';
import type { Router as ExpressRouter } from 'express';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { authUtils } from '../utils/auth.utils.js';
import passport from '../config/passport.config.js';

const router: ExpressRouter = Router();
const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// ==================== TRADITIONAL AUTH ====================

/**
 * POST /api/auth/signup
 * Register a new user with email and password
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Email and password are required' 
      });
    }

    if (!authUtils.isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Invalid email format' 
      });
    }

    const passwordValidation = authUtils.isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: passwordValidation.message 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User exists',
        message: 'An account with this email already exists' 
      });
    }

    // Hash password
    const passwordHash = await authUtils.hashPassword(password);
    const apiKey = `aethermind_${randomBytes(32).toString('hex')}`;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        passwordHash,
        apiKey,
        emailVerified: false,
        hasCompletedOnboarding: false,
        plan: 'free',
        usageLimit: 100,
        usageCount: 0
      }
    });

    // Generate JWT
    const token = authUtils.generateToken(user.id, user.email);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        emailVerified: user.emailVerified,
        plan: user.plan
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during signup' 
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await authUtils.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT
    const token = authUtils.generateToken(user.id, user.email);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        emailVerified: user.emailVerified,
        plan: user.plan,
        image: user.image,
        apiKey: user.apiKey
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred during login' 
    });
  }
});

// ==================== GOOGLE OAUTH ====================

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

/**
 * GET /api/auth/callback/google
 * Google OAuth callback
 */
router.get('/callback/google',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }

      // Generate JWT
      const token = authUtils.generateToken(user.id, user.email);
      
      // Redirect based on onboarding status
      const isNewUser = !user.hasCompletedOnboarding;
      const redirectUrl = isNewUser 
        ? `${FRONTEND_URL}/onboarding/welcome?token=${token}`
        : `${FRONTEND_URL}/login?token=${token}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// ==================== GITHUB OAUTH ====================

/**
 * GET /api/auth/github
 * Initiate GitHub OAuth flow
 */
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'],
    session: false 
  })
);

/**
 * GET /api/auth/callback/github
 * GitHub OAuth callback
 */
router.get('/callback/github',
  passport.authenticate('github', { 
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=github_auth_failed`
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      if (!user) {
        return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }

      // Generate JWT
      const token = authUtils.generateToken(user.id, user.email);
      
      // Redirect based on onboarding status
      const isNewUser = !user.hasCompletedOnboarding;
      const redirectUrl = isNewUser 
        ? `${FRONTEND_URL}/onboarding/welcome?token=${token}`
        : `${FRONTEND_URL}/login?token=${token}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('GitHub callback error:', error);
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// ==================== PASSWORD RESET ====================

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Email is required' 
      });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ 
        success: true,
        message: 'If that email exists, we sent a password reset link' 
      });
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // TODO: Send email with reset link
    // For now, just return success
    return res.json({ 
      success: true,
      message: 'If that email exists, we sent a password reset link',
      // In development, return the token
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred' 
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: 'Token and new password are required' 
      });
    }

    const passwordValidation = authUtils.isValidPassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        error: 'Validation error',
        message: passwordValidation.message 
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid token',
        message: 'Invalid or expired reset token' 
      });
    }

    const passwordHash = await authUtils.hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return res.json({ 
      success: true,
      message: 'Password reset successfully' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred' 
    });
  }
});

// ==================== ONBOARDING ====================

/**
 * POST /api/auth/complete-onboarding
 * Mark user as having completed onboarding
 */
router.post('/complete-onboarding', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = authUtils.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token' 
      });
    }

    const { plan } = req.body;

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        hasCompletedOnboarding: true,
        ...(plan && { plan })
      }
    });

    return res.json({ 
      success: true,
      message: 'Onboarding completed' 
    });

  } catch (error) {
    console.error('Complete onboarding error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An error occurred' 
    });
  }
});

export default router;

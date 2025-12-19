import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serialization (required by Passport but not really used with JWT)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ==================== GOOGLE OAUTH STRATEGY ====================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI || '/api/auth/callback/google',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if OAuth account already exists
          let oauthAccount = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId: profile.id
              }
            },
            include: { user: true }
          });

          if (oauthAccount) {
            // User already linked with Google
            return done(null, oauthAccount.user);
          }

          // Get email from Google profile
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email provided by Google'), null);
          }

          // Check if user exists with this email
          let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
          });

          if (user) {
            // User exists, link Google account
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: 'google',
                providerAccountId: profile.id,
                accessToken,
                refreshToken,
                tokenType: 'Bearer',
                scope: 'email profile'
              }
            });
          } else {
            // Create new user with Google account
            user = await prisma.user.create({
              data: {
                email: email.toLowerCase(),
                name: profile.displayName,
                image: profile.photos?.[0]?.value,
                emailVerified: new Date(),
                hasCompletedOnboarding: false,
                plan: 'free',
                accounts: {
                  create: {
                    provider: 'google',
                    providerAccountId: profile.id,
                    accessToken,
                    refreshToken,
                    tokenType: 'Bearer',
                    scope: 'email profile'
                  }
                }
              }
            });
          }

          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error as Error, null);
        }
      }
    )
  );
}

// ==================== GITHUB OAUTH STRATEGY ====================
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_REDIRECT_URI || '/api/auth/callback/github',
        scope: ['user:email']
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Check if OAuth account already exists
          let oauthAccount = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'github',
                providerAccountId: profile.id
              }
            },
            include: { user: true }
          });

          if (oauthAccount) {
            return done(null, oauthAccount.user);
          }

          // Get primary email (might be private on GitHub)
          const email = profile.emails?.[0]?.value || `${profile.username}@github.users.noreply.com`;

          // Check if user exists with this email
          let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
          });

          if (user) {
            // User exists, link GitHub account
            await prisma.oAuthAccount.create({
              data: {
                userId: user.id,
                provider: 'github',
                providerAccountId: profile.id,
                accessToken,
                refreshToken,
                tokenType: 'Bearer',
                scope: 'user:email'
              }
            });
          } else {
            // Create new user with GitHub account
            user = await prisma.user.create({
              data: {
                email: email.toLowerCase(),
                name: profile.displayName || profile.username,
                image: profile.photos?.[0]?.value,
                emailVerified: new Date(),
                hasCompletedOnboarding: false,
                plan: 'free',
                accounts: {
                  create: {
                    provider: 'github',
                    providerAccountId: profile.id,
                    accessToken,
                    refreshToken,
                    tokenType: 'Bearer',
                    scope: 'user:email'
                  }
                }
              }
            });
          }

          return done(null, user);
        } catch (error) {
          console.error('GitHub OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
}

export default passport;

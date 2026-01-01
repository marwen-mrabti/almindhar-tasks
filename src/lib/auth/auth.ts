import { sendEmailWithMagicLink } from '@/_features/auth/emails/send-magicLink-email';
import { sendWelcomeEmail } from '@/_features/auth/emails/send-welcome-email';
import { db } from '@/db';
import { env } from '@/lib/env';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware, magicLink } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BASE_URL,

  trustedOrigins: [
    env.BASE_URL,
    'http://localhost:3000',
  ],

  rateLimit: {
    enabled: true,
    storage: 'database', // by default it is stored in memory
    modelName: 'rateLimit', // name of the table in the database
    window: 60, // time window in seconds => //! in 60s a user can make 100 requests
    max: 100, // max requests in the window => //! request 101 gets blocked
    customRules: {
      '/get-session': false,
      '/sign-in/social/*': async (request) => {
        return {
          window: 60,
          max: 50,
        };
      },
      '/sign-in/magicLink': {
        window: 60,
        max: 50,
      }
    },
  },

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET!,
    },
  },


  onAPIError: {
    throw: true,
    onError: (error, ctx) => {
      const err = error as APIError;
      throw new APIError('INTERNAL_SERVER_ERROR', {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
      });
    },
    errorURL: '/error',
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          void sendWelcomeEmail({
            email: newSession.user.email,
            name: newSession.user.name,
          });
        }
      } else if (ctx.path === '/get-session') {
        if (!ctx.context.session) {
          return ctx.json({
            session: null,
            user: null,
          });
        }
        return ctx.json(ctx.context.session);
      }
    }),
  },

  plugins: [
    magicLink({
      expiresIn: 60 * 30, // 30 minutes in seconds
      sendMagicLink: async ({ email, url }) => {
        void sendEmailWithMagicLink({
          email,
          url,
        });
      },
    }),

    nextCookies()
  ],

  logger: {
    enabled: true,
    level: 'debug',
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = Session['user'];

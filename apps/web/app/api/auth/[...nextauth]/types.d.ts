import type { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken: string;
    githubId: string;
    username: string;
    portfolioId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken: string;
    githubId: string;
    username: string;
    portfolioId: string;
    avatarUrl: string;
  }
}
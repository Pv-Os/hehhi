import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.githubId    = account.providerAccountId;
        token.username    = (profile as any).login;
        token.avatarUrl   = (profile as any).avatar_url;

        // Save user + create portfolio in DB right after login
        try {
          const res = await fetch(`${process.env.API_URL ?? 'http://localhost:3001'}/api/portfolio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              githubId:  account.providerAccountId,
              username:  (profile as any).login,
              name:      profile.name ?? (profile as any).login,
              avatarUrl: (profile as any).avatar_url,
              email:     token.email ?? '',
            }),
          });

          const data = await res.json();
          token.portfolioId = data.portfolio?.id;
        } catch (err) {
          console.error('Failed to create user/portfolio in DB:', err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.githubId    = token.githubId as string;
      session.username    = token.username as string;
      session.portfolioId = token.portfolioId as string;
      return session;
    },
  },

  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
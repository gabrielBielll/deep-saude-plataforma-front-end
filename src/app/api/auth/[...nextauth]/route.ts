
import NextAuth from "next-auth"

console.log('NEXTAUTH_URL em produção:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV em produção:', process.env.NODE_ENV);
console.log('VERCEL_URL (para referência, pode não ser relevante no Render):', process.env.VERCEL_URL);
import GoogleProvider from "next-auth/providers/google"
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Store refresh token
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : undefined; // Store expiry time
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      (session as any).accessToken = token.accessToken;
      (session as any).error = token.error; // Pass along error flags
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

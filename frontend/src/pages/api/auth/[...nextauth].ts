import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "tubias" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const payload = {
          email: credentials?.username,
          password: credentials?.password,
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/authenticate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        const toks = await res.json();
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${toks.accessToken}`,
            },
          }
        );
        const user = await res2.json();
        if (res2.ok && user) {
          user.access_token = toks.accessToken;
          user.refresh_token = toks.refreshToken;
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.role = user.role;
        token.email = user.email;
        token.name = user.firstname;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.access_token = token.access_token;
        session.user.refresh_token = token.refresh_token;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },
  },
  pages: { signIn: "/login" },
  debug: process.env.NODE_ENV === "development" ? true : false,
};

export default NextAuth(authOptions);

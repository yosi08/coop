import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      const email = user.email?.toLowerCase() ?? "";
      return ALLOWED_EMAILS.includes(email);
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/aowjaqnwjsdydrhdrks/login",
    error: "/aowjaqnwjsdydrhdrks/login",
  },
});

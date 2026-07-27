import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as typeof user & { role?: string };
        token.sub = user.id ?? token.sub;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = user.image ?? token.picture;
        (token as typeof token & { role?: string }).role = typedUser.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string;
          image?: string | null;
        };

        sessionUser.id = token.sub ?? "";
        sessionUser.name = token.name ?? session.user.name;
        sessionUser.email = token.email ?? session.user.email;
        sessionUser.image = (token.picture as string | undefined) ?? session.user.image;
        sessionUser.role = (token as typeof token & { role?: string }).role || "user";
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

export const runtime = "nodejs";

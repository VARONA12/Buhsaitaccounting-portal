import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Телефон", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          throw new Error("Номер телефона не указан");
        }

        const user = await db.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          return null; // Пользователь не найден, нужно регистрироваться
        }

        return {
          id: user.id,
          name: user.name,
          company: user.company,
          phone: user.phone,
          plan: user.plan,
          birthDate: user.birthDate,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.company = (user as any).company;
        token.phone = (user as any).phone;
        token.plan = (user as any).plan;
        token.birthDate = (user as any).birthDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          company: token.company as string,
          phone: token.phone as string,
          plan: token.plan as string,
          birthDate: token.birthDate as string,
        } as any;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

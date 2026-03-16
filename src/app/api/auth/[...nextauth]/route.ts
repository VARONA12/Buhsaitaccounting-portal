import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP/Password",
      credentials: {
        phone: { label: "Телефон", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          throw new Error("Номер телефона не указан");
        }

        let user = await db.user.findUnique({
          where: { phone: credentials.phone },
        });

        // Если пароль передан, проверяем его
        if (credentials.password) {
          if (!user || !user.password) {
            throw new Error("Пользователь не найден или пароль не установлен");
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Неверный пароль");
          }
        } 
        // Если пароля нет, значит это вход через OTP (который уже проверен на предыдущем шаге в UI)
        else {
          if (!user) {
            // Авто-создание пользователя, если его нет (только для OTP входа)
            user = await db.user.create({
              data: {
                phone: credentials.phone,
                name: "Новый пользователь",
                company: "Моя Компания",
                plan: "Базовый",
              }
            });
          }
        }

        // Создаем запись о входе
        try {
          await db.loginSession.create({
            data: {
              userId: user!.id,
              device: "Браузер (Mac OS)",
              ip: "Вход через портал"
            }
          });
        } catch (e) {
          console.error("Failed to create login session", e);
        }

        return {
          id: user!.id,
          name: user!.name,
          company: user!.company,
          phone: user!.phone,
          plan: user!.plan,
          birthDate: user!.birthDate,
          isAdmin: user!.isAdmin,
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
        token.isAdmin = (user as any).isAdmin;
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
          isAdmin: token.isAdmin as boolean,
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

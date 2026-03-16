import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      company: string
      phone: string
      plan: string
      birthDate: string
    }
  }
}

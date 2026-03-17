// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const logPath = path.join(process.cwd(), "auth-debug.txt");
        const log = (msg: string) => {
          const logMsg = `${new Date().toISOString()} - ${msg}\n`;
          fs.appendFileSync(logPath, logMsg);
        };

        log("--- AUTH ATTEMPT START ---");
        log("Email: " + (credentials?.email || "MISSING"));
        log("Password length: " + (credentials?.password?.length || 0));

        if (!credentials?.email || !credentials?.password) {
          log("Result: FAILED (Missing credentials)");
          return null;
        }

        try {
          log("Querying database for user...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          log("User record found: " + (user ? "YES" : "NO"));

          if (!user) {
            log("Result: FAILED (User not found)");
            return null;
          }

          if (!user.password) {
            log("Result: FAILED (User has no password field in DB)");
            return null;
          }

          log("Comparing passwords...");
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          log("Password match: " + passwordMatch);

          if (!passwordMatch) {
            log("Result: FAILED (Password mismatch)");
            return null;
          }

          log("Result: SUCCESS (User authenticated)");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          log("CRITICAL ERROR: " + error.message);
          if (error.stack) log("STACK: " + error.stack);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
};
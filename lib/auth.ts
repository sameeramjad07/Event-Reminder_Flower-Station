// lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "./mongodb";
import clientPromise from "./mongodb-client";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { AdapterSession } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

console.log("Initializing NextAuth configuration");

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is missing in environment variables!");
  throw new Error("NEXTAUTH_SECRET is required");
}

if (!process.env.NEXTAUTH_URL) {
  console.warn(
    "NEXTAUTH_URL is not set. This might cause issues in production."
  );
}

// Define custom user interface
interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }

  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string | null;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        console.log("NextAuth: authorize function called");
        if (!credentials?.email || !credentials?.password) {
          console.log("NextAuth: Missing email or password");
          return null;
        }

        try {
          console.log(
            `NextAuth: Attempting to connect to database for user: ${credentials.email}`
          );
          await connectToDatabase();
          console.log("NextAuth: Database connected successfully");

          console.log(
            `NextAuth: Looking up user with email: ${credentials.email}`
          );
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log(
              `NextAuth: No user found with email: ${credentials.email}`
            );
            return null;
          }

          console.log("NextAuth: User found, comparing password");
          const isPasswordValid = await bcrypt.compare(
            String(credentials.password),
            String(user.password)
          );

          if (!isPasswordValid) {
            console.log("NextAuth: Password is invalid");
            return null;
          }

          console.log("NextAuth: Authentication successful");
          return {
            id: user._id.toString(),
            name: user.name ?? null,
            email: user.email ?? null,
            image: user.image ?? null,
            role: user.role ?? null,
          };
        } catch (error) {
          console.error("NextAuth: Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("NextAuth: Adding user data to JWT token");
        token.id = user.id;
        token.role = user.role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        console.log("NextAuth: Adding user data to session");
        session.user.id = token.id as string;
        session.user.role = token.role ?? null;
        session.user.name = session.user.name ?? null;
        session.user.email = session.user.email ?? null;
        session.user.image = session.user.image ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login", // Optional; typically not needed with JWT
    error: "/login",
  },
  events: {
    async signOut({
      session,
      token,
    }: {
      session?: AdapterSession | null | void;
      token?: JWT | null;
    }) {
      console.log("User signed out", { session, token });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(error: Error) {
      console.error("NextAuth Error:", error);
    },
    warn(code: string) {
      console.warn(`NextAuth Warning: ${code}`);
    },
    debug(code: string, metadata: any) {
      console.log(`NextAuth Debug: ${code}`, metadata);
    },
  },
};

// Export handlers and utilities
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);

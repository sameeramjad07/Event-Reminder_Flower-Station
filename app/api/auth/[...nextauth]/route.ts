// app/api/auth/[...nextauth].ts
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Initialize NextAuth
const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export the handlers for GET and POST
export const GET = handlers.GET;
export const POST = handlers.POST;

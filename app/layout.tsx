import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flower Station Event Manager",
  description: "A complete event management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Root layout rendering")

  // Log environment variables for debugging
  console.log("Environment variables check:")
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? "Set" : "Not set"}`)
  console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? "Set" : "Not set"}`)
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? "Set" : "Not set"}`)
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-green-50 max-w-[2000px] mx-auto`}>
      <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Dashboard | Flower Station Event Manager",
  description: "Manage your events and reminders with a natural touch",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Dashboard layout rendering");

  try {
    const session = await auth();
    console.log("Auth session result:", !!session?.user);

    if (!session || !session.user) {
      console.log("No session found, redirecting to login");
      redirect("/login");
    }

    console.log("User authenticated, rendering dashboard layout");

    return (
      <SessionProvider session={session}>
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900 max-w-[2000px] mx-auto">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header user={session.user} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 container mx-auto">
              {children}
            </main>
          </div>
        </div>
      </SessionProvider>
    );
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    redirect("/login?error=session");
  }
}

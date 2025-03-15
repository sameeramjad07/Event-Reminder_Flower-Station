"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Home,
  LogOut,
  Settings,
  User,
  Flower,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function Sidebar() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Sidebar component mounted");
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-green-100 dark:border-green-800 bg-white dark:bg-gray-900">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <Flower className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            <h1 className="text-xl font-bold text-green-800 dark:text-green-300">
              Flower Station
            </h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-300"
                      : "text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-800 dark:hover:text-green-300"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-green-500 dark:text-green-500 group-hover:text-green-600 dark:group-hover:text-green-400"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 p-4 border-t border-green-100 dark:border-green-800">
          <SignOutButton
            variant="outline"
            className="w-full justify-start text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
            Sign out
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}

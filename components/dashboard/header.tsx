"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flower } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getNotifications } from "@/app/actions/notifications";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Header component mounted");
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    console.log("Fetching notifications");
    try {
      const result = await getNotifications();
      console.log("Notifications result:", result);
      if (result.success) {
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  function getTitle() {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/events") return "Events";
    if (pathname === "/dashboard/profile") return "Profile";
    if (pathname === "/dashboard/notifications") return "Notifications";
    if (pathname === "/dashboard/settings") return "Settings";
    if (pathname.startsWith("/dashboard/events/")) return "Event Details";
    return "Dashboard";
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-green-100 dark:border-green-800 h-16 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          className="text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/50"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-green-800 dark:text-green-300">
          {getTitle()}
        </h1>
      </div>

      <div className="hidden lg:flex lg:items-center lg:gap-2">
        <Flower className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
        <h1 className="text-xl font-semibold text-green-800 dark:text-green-300">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/dashboard/notifications">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/50"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/50"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-green-100 dark:border-green-800"
          >
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium text-green-800 dark:text-green-300">
                  {user.name}
                </span>
                <span className="text-xs text-green-600 dark:text-green-400">
                  {user.email}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="text-green-700 dark:text-green-400"
              >
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/settings"
                className="text-green-700 dark:text-green-400"
              >
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-rose-600 dark:text-rose-400 cursor-pointer">
              <SignOutButton
                variant="ghost"
                size="sm"
                className="w-full justify-start p-0 h-auto text-rose-600 dark:text-rose-400 hover:bg-transparent"
              >
                Sign out
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNotifications,
  markNotificationRead,
} from "@/app/actions/notifications";
import { toast } from "sonner";

interface NotificationsListProps {
  limit?: number;
}

export default function NotificationsList({ limit }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("NotificationsList component mounted");
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    console.log("Fetching notifications list");
    setLoading(true);
    try {
      const result = await getNotifications();
      console.log("Notifications list result:", result);
      if (result.success) {
        setNotifications(
          limit ? result.notifications.slice(0, limit) : result.notifications
        );
      }
    } catch (error) {
      console.error("Error fetching notifications list:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Marking notification as read:", id);
    try {
      const result = await markNotificationRead(id);
      console.log("Mark as read result:", result);
      if (result.success) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        );
        toast.success("Notification marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }

  if (loading) {
    return (
      <div className="py-4 text-center text-green-600">
        Loading notifications...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-green-600 py-4">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Link
          key={notification.id}
          href={`/dashboard/events/${notification.eventId}`}
          className="block"
        >
          <div
            className={`flex items-start justify-between p-4 rounded-lg transition-colors ${
              notification.read ? "bg-white" : "bg-green-50"
            }`}
          >
            <div className="space-y-1">
              <p
                className={`text-sm ${
                  notification.read
                    ? "text-green-600"
                    : "font-medium text-green-800"
                }`}
              >
                {notification.message}
              </p>
              <p className="text-xs text-green-500">
                {format(new Date(notification.createdAt), "PPp")}
              </p>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100"
                onClick={(e) => handleMarkAsRead(notification.id, e)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
        </Link>
      ))}

      {limit && notifications.length >= limit && (
        <div className="pt-2">
          <Link href="/dashboard/notifications">
            <Button
              variant="outline"
              className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            >
              View all notifications
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

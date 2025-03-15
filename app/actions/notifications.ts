"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Notification from "@/models/Notification";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, notifications: [] };
  }

  try {
    await connectToDatabase();

    const notifications = await Notification.find({
      user: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("event", "title");

    return {
      success: true,
      notifications: notifications.map((notification) => ({
        id: notification._id.toString(),
        message: notification.message,
        eventId: notification.event._id.toString(),
        eventTitle: notification.event.title,
        read: notification.read,
        createdAt: notification.createdAt,
      })),
      unreadCount: await Notification.countDocuments({
        user: session.user.id,
        read: false,
      }),
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, notifications: [] };
  }
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false };
  }

  try {
    await connectToDatabase();

    await Notification.findOneAndUpdate(
      { _id: notificationId, user: session.user.id },
      { read: true }
    );

    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false };
  }
}

export async function markAllNotificationsRead() {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false };
  }

  try {
    await connectToDatabase();

    await Notification.updateMany(
      { user: session.user.id, read: false },
      { read: true }
    );

    revalidatePath("/dashboard");
    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false };
  }
}

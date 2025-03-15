"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Notification from "@/models/Notification";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, message: "You must be logged in" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const customType = formData.get("customType") as string;
  const attendees = formData.get("attendees") as string;

  if (!title || !date || !type) {
    return { success: false, message: "Title, date, and type are required" };
  }

  try {
    await connectToDatabase();

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      type,
      customType: type === "Other" ? customType : undefined,
      user: session.user.id,
      attendees: attendees
        ? attendees.split(",").map((email) => email.trim())
        : [],
      reminderSent: false,
    });

    await newEvent.save();

    // Create notification for the event creator
    await Notification.create({
      user: session.user.id,
      event: newEvent._id,
      message: `New event "${title}" created for ${new Date(
        date
      ).toLocaleDateString()}`,
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Event created successfully" };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, message: "Failed to create event" };
  }
}

export async function getEvents() {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, events: [] };
  }

  try {
    await connectToDatabase();

    const events = await Event.find({ user: session.user.id }).sort({
      date: 1,
    });

    return {
      success: true,
      events: events.map((event) => ({
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date.toISOString(),
        time: event.time,
        location: event.location,
        type: event.type,
        customType: event.customType,
        attendees: event.attendees,
        reminderSent: event.reminderSent,
        createdAt: event.createdAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, events: [] };
  }
}

export async function updateEvent(eventId: string, formData: FormData) {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, message: "You must be logged in" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;
  const customType = formData.get("customType") as string;
  const attendees = formData.get("attendees") as string;

  if (!title || !date || !type) {
    return { success: false, message: "Title, date, and type are required" };
  }

  try {
    await connectToDatabase();

    // Verify event belongs to user
    const event = await Event.findOne({ _id: eventId, user: session.user.id });

    if (!event) {
      return {
        success: false,
        message: "Event not found or you don't have permission",
      };
    }

    // Update event
    await Event.findByIdAndUpdate(eventId, {
      title,
      description,
      date: new Date(date),
      time,
      location,
      type,
      customType: type === "Other" ? customType : undefined,
      attendees: attendees
        ? attendees.split(",").map((email) => email.trim())
        : [],
    });

    revalidatePath("/dashboard");
    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Event updated successfully" };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, message: "Failed to update event" };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await auth();

  if (!session || !session.user) {
    return { success: false, message: "You must be logged in" };
  }

  try {
    await connectToDatabase();

    // Verify event belongs to user
    const event = await Event.findOne({ _id: eventId, user: session.user.id });

    if (!event) {
      return {
        success: false,
        message: "Event not found or you don't have permission",
      };
    }

    // Delete event
    await Event.findByIdAndDelete(eventId);

    // Remove related notifications
    await Notification.deleteMany({ event: eventId });

    revalidatePath("/dashboard");
    return { success: true, message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, message: "Failed to delete event" };
  }
}

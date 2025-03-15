import { type NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import Notification from "@/models/Notification";
import { sendEventReminder } from "@/lib/email";

// This route should be called by a cron job scheduler (e.g., Vercel Cron)
// It will check for events happening today and send reminders

export async function GET(request: NextRequest) {
  console.log("Running send-reminders cron job");

  // Check for authorization token if needed
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`)
  ) {
    console.error("Unauthorized cron job attempt");
    console.error("Expected:", `Bearer ${process.env.CRON_SECRET}`);
    console.error("Received:", authHeader);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Connecting to database for cron job");
    await connectToDatabase();
    console.log("Database connected successfully for cron job");

    // Get today's date (start and end of day)
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    console.log(
      `Checking for events between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`
    );

    // Find events happening today that haven't had reminders sent
    const events = await Event.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      reminderSent: false,
    }).populate("user", "email name");

    console.log(`Found ${events.length} events requiring reminders`);

    const results = [];

    // Send reminders for each event
    for (const event of events) {
      console.log(`Processing event: ${event._id} - ${event.title}`);

      try {
        // Send email to event owner
        if (event.user && event.user.email) {
          console.log(`Sending reminder to event owner: ${event.user.email}`);
          const emailResult = await sendEventReminder(
            event.user.email,
            event.title,
            event.date.toISOString(),
            event.time,
            event.location
          );

          results.push({
            eventId: event._id,
            recipient: event.user.email,
            success: emailResult.success,
          });

          if (!emailResult.success) {
            console.error(
              `Failed to send email to ${event.user.email}:`,
              emailResult.error
            );
          }
        } else {
          console.warn(
            `Event ${event._id} has no user email, skipping owner notification`
          );
        }

        // Send emails to attendees if any
        if (event.attendees && event.attendees.length > 0) {
          console.log(
            `Sending reminders to ${event.attendees.length} attendees`
          );
          for (const attendeeEmail of event.attendees) {
            console.log(`Sending reminder to attendee: ${attendeeEmail}`);
            const emailResult = await sendEventReminder(
              attendeeEmail,
              event.title,
              event.date.toISOString(),
              event.time,
              event.location
            );

            results.push({
              eventId: event._id,
              recipient: attendeeEmail,
              success: emailResult.success,
            });

            if (!emailResult.success) {
              console.error(
                `Failed to send email to attendee ${attendeeEmail}:`,
                emailResult.error
              );
            }
          }
        } else {
          console.log(`Event ${event._id} has no attendees`);
        }

        // Create notification for the event owner
        try {
          console.log(`Creating notification for event ${event._id}`);
          await Notification.create({
            user: event.user._id,
            event: event._id,
            message: `Reminder: Your event "${event.title}" is today!`,
          });
          console.log(
            `Notification created successfully for event ${event._id}`
          );
        } catch (notifError) {
          console.error(
            `Error creating notification for event ${event._id}:`,
            notifError
          );
        }

        // Mark the event as having had reminders sent
        try {
          console.log(`Marking event ${event._id} as reminded`);
          event.reminderSent = true;
          await event.save();
          console.log(`Event ${event._id} marked as reminded successfully`);
        } catch (saveError) {
          console.error(
            `Error marking event ${event._id} as reminded:`,
            saveError
          );
        }
      } catch (eventError) {
        console.error(`Error processing event ${event._id}:`, eventError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${events.length} events`,
      results,
    });
  } catch (error) {
    console.error("Error in send-reminders cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

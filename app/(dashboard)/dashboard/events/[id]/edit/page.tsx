import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/components/events/event-form";
import { auth } from "@/lib/auth";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const resolvedParams = await params;
  console.log("Edit event page rendering for event:", resolvedParams.id);

  const session = await auth();

  if (!session?.user) {
    console.log("No session found in edit event page");
    return null;
  }

  try {
    console.log("Connecting to database for edit event page");
    await connectToDatabase();
    console.log("Database connected successfully for edit event page");

    console.log("Fetching event:", resolvedParams.id);
    const event = await Event.findOne({
      _id: resolvedParams.id,
      user: session.user.id,
    });

    if (!event) {
      console.log("Event not found or user doesn't have permission");
      notFound();
    }

    console.log("Event found:", event.title);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300">
            Edit Event
          </h2>
          <p className="text-muted-foreground dark:text-green-400">
            Update your event details
          </p>
        </div>

        <Card className="border-green-100 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300">
              Event Details
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Make changes to your event information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm
              initialData={{
                id: event._id.toString(),
                title: event.title,
                description: event.description,
                date: event.date.toISOString(),
                time: event.time,
                location: event.location,
                type: event.type,
                customType: event.customType,
                attendees: event.attendees,
              }}
              isEditing={true}
            />
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error in edit event page:", error);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300">
            Error
          </h2>
          <p className="text-rose-600">
            Failed to load event. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

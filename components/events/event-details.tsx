"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Trash,
  Users,
  Flower,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/app/actions/events";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface EventDetailsProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    location?: string;
    type: string;
    customType?: string;
    attendees?: string[];
    reminderSent: boolean;
    createdAt: Date;
  };
}

export default function EventDetails({ event }: EventDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("EventDetails component mounted", { eventId: event.id });
  }, [event.id]);

  async function handleDeleteEvent() {
    console.log("Deleting event:", event.id);
    setIsDeleting(true);
    try {
      const result = await deleteEvent(event.id);
      console.log("Delete event result:", result);

      if (result.success) {
        toast.success("Event Deleted");
        router.push("/dashboard/events");
        router.refresh();
      } else {
        console.error("Failed to delete event:", result.message);
        toast.error("Failed to Delete Event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <Badge
            variant="outline"
            className="mb-2 border-green-200 text-green-700 bg-green-50"
          >
            {event.type === "Other" ? event.customType : event.type}
          </Badge>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-green-700">
              <Calendar className="mr-2 h-4 w-4 text-green-600" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            {event.time && (
              <div className="flex items-center text-sm text-green-700">
                <Clock className="mr-2 h-4 w-4 text-green-600" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center text-sm text-green-700">
                <MapPin className="mr-2 h-4 w-4 text-green-600" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            asChild
            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <Link href={`/dashboard/events/${event.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {event.description && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-green-800">Description</h3>
          <p className="text-green-700 whitespace-pre-line">
            {event.description}
          </p>
        </div>
      )}

      {event.attendees && event.attendees.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-green-800">Attendees</h3>
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              {event.attendees.map((attendee, index) => (
                <div key={index} className="text-green-700">
                  {attendee}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-green-100">
        <div className="flex items-center text-xs text-green-600">
          <Flower className="mr-2 h-4 w-4" />
          <p>
            Created on {format(new Date(event.createdAt), "PPp")}
            {event.reminderSent && " • Reminder sent"}
          </p>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="border-green-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-800">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-green-600">
              This action cannot be undone. This will permanently delete the
              event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit, MoreHorizontal, Trash, Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { deleteEvent } from "@/app/actions/events";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  location?: string;
}

export default function EventsTable({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("EventsTable component mounted", { eventCount: events.length });
  }, [events.length]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location &&
        event.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleDeleteEvent() {
    if (!eventToDelete) return;

    console.log("Deleting event:", eventToDelete);
    setIsDeleting(true);
    try {
      const result = await deleteEvent(eventToDelete);
      console.log("Delete event result:", result);

      if (result.success) {
        toast.success("Event deleted");
        router.refresh();
      } else {
        console.error("Failed to delete event:", result.message);
        toast.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
      setEventToDelete(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm border-green-200 focus:border-green-500 focus:ring-green-500"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="py-8 text-center">
          <Flower className="mx-auto h-12 w-12 text-green-300" />
          <h3 className="mt-4 text-lg font-semibold text-green-800">
            No events found
          </h3>
          <p className="mt-2 text-sm text-green-600">
            {events.length === 0
              ? "Get started by creating your first event"
              : "Try adjusting your search terms"}
          </p>
          {events.length === 0 && (
            <Button
              className="mt-4 bg-green-600 hover:bg-green-700"
              onClick={() => router.push("/dashboard/events/new")}
            >
              Create Event
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border border-green-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-green-50">
              <TableRow className="hover:bg-green-100/50">
                <TableHead className="text-green-800">Event Name</TableHead>
                <TableHead className="text-green-800">Date</TableHead>
                <TableHead className="text-green-800">Type</TableHead>
                <TableHead className="text-green-800">Location</TableHead>
                <TableHead className="w-[100px] text-green-800">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-green-50">
                  <TableCell className="font-medium text-green-800">
                    {event.title}
                  </TableCell>
                  <TableCell className="text-green-700">
                    {format(new Date(event.date), "PPP")}
                  </TableCell>
                  <TableCell className="text-green-700">{event.type}</TableCell>
                  <TableCell className="text-green-700">
                    {event.location || "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-700 hover:text-green-800 hover:bg-green-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-green-100"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/events/${event.id}`}
                            className="text-green-700"
                          >
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/events/${event.id}/edit`}
                            className="text-green-700"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-rose-600"
                          onClick={() => setEventToDelete(event.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(open) => !open && setEventToDelete(null)}
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

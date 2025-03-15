import Link from "next/link";
import { getEvents } from "@/app/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import EventsTable from "@/components/events/events-table";

export default async function EventsPage() {
  const { events } = await getEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Events</CardTitle>
          <CardDescription>
            View and manage all your scheduled events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventsTable events={events || []} />
        </CardContent>
      </Card>
    </div>
  );
}

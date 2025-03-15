import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getEvents } from "@/app/actions/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import NotificationsList from "@/components/dashboard/notifications-list";

export default async function DashboardPage() {
  console.log("Dashboard page rendering");
  const session = await auth();

  if (!session?.user) {
    console.log("No session found in dashboard page");
    return null;
  }

  console.log("Fetching events for dashboard");
  const { events } = await getEvents();
  console.log(`Found ${events?.length || 0} events`);

  const upcomingEvents = events
    ?.filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const today = new Date().toISOString().split("T")[0];
  const todayEvents = events?.filter(
    (event) => new Date(event.date).toISOString().split("T")[0] === today
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300">
            Welcome back, {session.user.name}
          </h2>
          <p className="text-green-600 dark:text-green-400">
            Manage your events and reminders with a natural touch
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button className="cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-100 dark:border-green-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-green-50 dark:border-green-800">
            <div className="space-y-1">
              <CardTitle className="text-green-800 dark:text-green-300">
                Total Events
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                All your scheduled events
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">
              {events?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 dark:border-green-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-green-50 dark:border-green-800">
            <div className="space-y-1">
              <CardTitle className="text-green-800 dark:text-green-300">
                Today&apos;s Events
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Events happening today
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">
              {todayEvents?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1 border-green-100 dark:border-green-800 shadow-sm">
          <CardHeader className="border-b border-green-50 dark:border-green-800">
            <CardTitle className="text-green-800 dark:text-green-300">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense
              fallback={
                <div className="py-4 text-center text-green-600 dark:text-green-400">
                  Loading upcoming events...
                </div>
              }
            >
              <UpcomingEvents events={upcomingEvents || []} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-green-100 dark:border-green-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-green-50 dark:border-green-800">
            <CardTitle className="text-green-800 dark:text-green-300">
              Recent Notifications
            </CardTitle>
            <Link href="/dashboard/notifications">
              <Button
                variant="link"
                size="sm"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            <Suspense
              fallback={
                <div className="py-4 text-center text-green-600 dark:text-green-400">
                  Loading notifications...
                </div>
              }
            >
              <NotificationsList limit={5} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

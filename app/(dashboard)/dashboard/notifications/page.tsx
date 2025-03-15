import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotificationsList from "@/components/dashboard/notifications-list";
import { markAllNotificationsRead } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";

async function handleMarkAllRead(formData: FormData) {
  "use server";
  await markAllNotificationsRead();
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            View and manage your notifications
          </p>
        </div>
        <form action={handleMarkAllRead}>
          <Button variant="outline" type="submit">
            Mark all as read
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>
            Notifications about your events and reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList />
        </CardContent>
      </Card>
    </div>
  );
}

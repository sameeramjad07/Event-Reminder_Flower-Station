import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsForm from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-green-800 dark:text-green-300">
          Settings
        </h2>
        <p className="text-muted-foreground dark:text-green-400">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="border-green-100 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-300">
            Account Settings
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Update your account preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={session.user} />
        </CardContent>
      </Card>
    </div>
  );
}

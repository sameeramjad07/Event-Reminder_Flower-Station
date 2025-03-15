"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SettingsFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user.name || "",
    emailNotifications: true,
    darkMode: false,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real application, this would be a server action
      // For now, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Settings Updated");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update settings";
      setError(errorMessage);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert
          variant="destructive"
          className="bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-green-800 dark:text-green-300">
            Display Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            disabled={isLoading}
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-green-800 dark:text-green-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={user.email || ""}
            disabled={true}
            aria-readonly={true}
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white opacity-70"
          />
          <p className="text-sm text-muted-foreground dark:text-green-400">
            Your email cannot be changed
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label
              htmlFor="emailNotifications"
              className="text-green-800 dark:text-green-300"
            >
              Email Notifications
            </Label>
            <p className="text-sm text-muted-foreground dark:text-green-400">
              Receive email notifications for events and reminders
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={formData.emailNotifications}
            onCheckedChange={(checked) =>
              handleChange("emailNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label
              htmlFor="darkMode"
              className="text-green-800 dark:text-green-300"
            >
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground dark:text-green-400">
              Use dark mode by default
            </p>
          </div>
          <Switch
            id="darkMode"
            checked={formData.darkMode}
            onCheckedChange={(checked) => handleChange("darkMode", checked)}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
      >
        {isLoading ? "Updating..." : "Update Settings"}
      </Button>
    </form>
  );
}

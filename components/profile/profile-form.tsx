"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/actions/profile";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user.name || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);

      const result = await updateUserProfile(formDataObj);

      if (result.success) {
        toast.success("Profile updated");
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setError(errorMessage);
      toast.error("Failed to update profile");
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
            Name
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
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}

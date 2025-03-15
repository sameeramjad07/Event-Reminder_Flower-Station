"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
    console.log("RegisterForm mounted");
  }, []);

  async function handleSubmit(formData: FormData) {
    console.log("Register form submitted");
    setIsLoading(true);
    setError("");

    // Basic validation
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      console.error("Password mismatch");
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);
      console.log("Registration result:", result);

      if (result.success) {
        toast.success("User Account Created Successfully");
        router.push("/login");
      } else {
        setError(result.message || "Registration failed");
        console.error("Registration failed:", result.message);
        toast.error("Registration Failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error("Some Error Occured while Registration");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) {
    return null; // Prevent hydration errors by not rendering until client-side
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-green-100 dark:border-green-800"
    >
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
            name="name"
            placeholder="John Doe"
            required
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-green-800 dark:text-green-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-green-800 dark:text-green-300"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-green-600 dark:text-green-400">
            Must be at least 8 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-green-800 dark:text-green-300"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="cursor-pointer w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="text-center text-sm text-green-700 dark:text-green-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-green-600 hover:text-green-500 hover:underline dark:text-green-400 dark:hover:text-green-300"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
    console.log("LoginForm mounted");
  }, []);

  async function handleSubmit(formData: FormData) {
    console.log("Login form submitted");
    setIsLoading(true);
    setError("");

    // Client-side validation
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginUser(formData);
      console.log("Login result:", result);

      if (result.success) {
        toast.success("Login successful");
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.message || "Login failed");
        console.error("Login failed:", result.message);
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error("Login Error");
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
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-green-800 dark:text-green-300"
            >
              Password
            </Label>
          </div>
          <Input
            id="password"
            name="password"
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
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center text-sm text-green-700 dark:text-green-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-green-600 hover:text-green-500 hover:underline dark:text-green-400 dark:hover:text-green-300"
        >
          Register
        </Link>
      </div>
    </form>
  );
}

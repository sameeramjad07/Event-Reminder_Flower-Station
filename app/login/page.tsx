import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();

  // Redirect to dashboard if already authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-green-800">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-green-600">
            Enter your email below to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RegisterForm from "@/components/auth/register-form";

export default async function RegisterPage() {
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
            Create an account
          </h1>
          <p className="mt-2 text-sm text-green-600">
            Enter your information below to create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}

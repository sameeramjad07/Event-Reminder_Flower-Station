import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Flower, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  console.log("Home page rendering");
  const session = await auth();

  if (session?.user) {
    console.log("User authenticated, redirecting to dashboard");
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-gray-900 dark:text-white">
      <header className="sticky top-0 z-50 w-full border-b border-green-100 dark:border-green-900 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Flower className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="font-bold text-green-800 dark:text-green-300">
                Flower System
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer text-green-700 hover:text-green-800 hover:bg-green-50 dark:text-green-300 dark:hover:bg-green-900/50"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex flex-col items-center gap-4 text-center">
            <Flower className="h-12 w-12 text-green-600 dark:text-green-400 mb-2" />
            <h1 className="text-3xl font-bold tracking-tighter text-green-800 dark:text-green-300 sm:text-5xl md:text-6xl lg:text-7xl">
              Event Management System
            </h1>
            <p className="max-w-[42rem] leading-normal text-green-600 dark:text-green-400 sm:text-xl sm:leading-8">
              Create, manage, and get reminders for all your special events
              easily and efficiently.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/50"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container space-y-12 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="rounded-full bg-green-50 dark:bg-green-900 p-3">
                <CalendarDays className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                Easy Event Creation
              </h3>
              <p className="text-center text-green-600 dark:text-green-400">
                Create events in seconds with our intuitive interface. Add all
                the details you need.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="rounded-full bg-green-50 dark:bg-green-900 p-3">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                Timely Reminders
              </h3>
              <p className="text-center text-green-600 dark:text-green-400">
                Never miss an important event again with our email notification
                system.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="rounded-full bg-green-50 dark:bg-green-900 p-3">
                <Flower className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                Natural Experience
              </h3>
              <p className="text-center text-green-600 dark:text-green-400">
                Enjoy a beautiful, organic interface designed to bring natural
                beauty to your event planning.
              </p>
            </div>
          </div>
        </section>

        {/* Developer Branding Section */}
        <section className="container py-12 border-t border-green-100 dark:border-green-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">
              Developed by Muhammad Sameer Amjad
            </h2>
            <p className="text-green-600 dark:text-green-400 mb-6">
              This project was created for Flower Station as a demonstration of
              my web development skills. Feel free to check out my other
              projects and connect with me!
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/50 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border bg-transparent px-6 font-medium transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)]"
              >
                <a
                  href="https://github.com/sameeramjad07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub Profile
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/50 group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border bg-transparent px-6 font-medium transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)]"
              >
                <a
                  href="https://linkedin.com/in/sameer-amjad"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-green-100 dark:border-green-900 py-6 md:py-8 bg-white dark:bg-gray-900 px-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <Flower className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-center text-sm leading-loose text-green-600 dark:text-green-400 md:text-left">
              © {new Date().getFullYear()} Flower Station Event Manager. All
              rights reserved.
            </p>
          </div>
          <div className="flex items-center">
            <Link
              href="/"
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              System Diagnostics
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

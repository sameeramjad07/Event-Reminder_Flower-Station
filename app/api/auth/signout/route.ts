import { type NextRequest, NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";

export async function POST(request: NextRequest) {
  console.log("Sign-out API route called");

  try {
    // Check if user is authenticated
    const session = await auth();

    if (!session) {
      console.log("No session found, user already signed out");
      return NextResponse.json({
        success: true,
        message: "Already signed out",
      });
    }

    // Perform sign-out
    await signOut();

    console.log("API sign-out successful");

    // Clear cookies
    const response = NextResponse.json({ success: true });
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");

    return response;
  } catch (error) {
    console.error("API sign-out error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sign out",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

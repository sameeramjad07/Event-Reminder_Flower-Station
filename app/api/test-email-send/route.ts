import { type NextRequest, NextResponse } from "next/server";
import { sendEventReminder } from "@/lib/email";

export async function GET(request: NextRequest) {
  console.log("Manual email test endpoint called");

  // Get email from query params
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        message: "Email parameter is required",
      },
      { status: 400 }
    );
  }

  try {
    // Send a test email
    const result = await sendEventReminder(
      email,
      "Test Event",
      new Date().toISOString(),
      "12:00 PM",
      "Test Location"
    );

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Test email sent successfully"
        : "Failed to send test email",
      result,
    });
  } catch (error) {
    console.error("Error in manual email test:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(formData: FormData) {
  console.log("updateUserSettings action called");

  const session = await auth();
  console.log("Session check for updateUserSettings:", !!session?.user);

  if (!session || !session.user) {
    console.log("updateUserSettings failed: User not authenticated");
    return { success: false, message: "You must be logged in" };
  }

  const name = formData.get("name") as string;
  const emailNotifications = formData.get("emailNotifications") === "true";

  console.log("Settings update data:", { name, emailNotifications });

  try {
    console.log("Connecting to database for updateUserSettings");
    await connectToDatabase();
    console.log("Database connected successfully for updateUserSettings");

    console.log("Updating user settings for user:", session.user.id);
    await User.findByIdAndUpdate(session.user.id, {
      name,
      settings: {
        emailNotifications,
      },
    });
    console.log("User settings updated successfully");

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating user settings:", error);
    return {
      success: false,
      message: "Failed to update settings",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

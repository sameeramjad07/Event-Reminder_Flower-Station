"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  console.log("updateUserProfile action called");

  const session = await auth();
  console.log("Session check for updateUserProfile:", !!session?.user);

  if (!session || !session.user) {
    console.log("updateUserProfile failed: User not authenticated");
    return { success: false, message: "You must be logged in" };
  }

  const name = formData.get("name") as string;

  console.log("Profile update data:", { name });

  if (!name.trim()) {
    console.log("updateUserProfile failed: Name is required");
    return { success: false, message: "Name is required" };
  }

  try {
    console.log("Connecting to database for updateUserProfile");
    await connectToDatabase();
    console.log("Database connected successfully for updateUserProfile");

    console.log("Updating user profile for user:", session.user.id);
    await User.findByIdAndUpdate(session.user.id, {
      name,
    });
    console.log("User profile updated successfully");

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

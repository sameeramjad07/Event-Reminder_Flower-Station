"use server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import mongoose from "mongoose";

export async function registerUser(formData: FormData) {
  console.log("registerUser action called");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(`Registration attempt for email: ${email}`);

  if (!name || !email || !password) {
    console.log("Registration failed: Missing required fields");
    return { success: false, message: "All fields are required" };
  }

  try {
    console.log("Connecting to database for registration");
    await connectToDatabase();
    console.log("Database connected successfully for registration");

    // Check if user already exists
    console.log(`Checking if user already exists with email: ${email}`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(
        `Registration failed: User already exists with email: ${email}`
      );
      return { success: false, message: "User already exists with this email" };
    }

    // Create new user
    console.log("Creating new user");
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
    });

    console.log("Saving new user to database");
    await newUser.save();
    console.log("User saved successfully");

    return {
      success: true,
      message: "Registration successful. Please log in.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    // Provide more specific error messages based on error type
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation error:", error.message);
      return { success: false, message: "Validation error: " + error.message };
    }

    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      console.error("Database connection error:", error.message);
      return {
        success: false,
        message:
          "Could not connect to the database. Please try again later or contact support.",
      };
    }

    return {
      success: false,
      message: "Failed to register. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function loginUser(formData: FormData) {
  console.log("loginUser action called");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(`Login attempt for email: ${email}`);

  if (!email || !password) {
    console.log("Login failed: Missing email or password");
    return { success: false, message: "Email and password are required" };
  }

  try {
    console.log("Attempting to sign in with credentials");
    await signIn("credentials", { email, password, redirect: false });
    console.log("Sign in successful");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log("Invalid credentials");
          return { success: false, message: "Invalid email or password" };
        default:
          console.log(`Auth error: ${error.type}`);
          return { success: false, message: "Something went wrong" };
      }
    }

    return {
      success: false,
      message: "An error occurred during login",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Server-side sign out action
export async function handleSignOut() {
  console.log("Server-side sign out action called");

  try {
    await signOut();
    console.log("Server-side sign out successful");
    return { success: true };
  } catch (error) {
    console.error("Server-side sign out error:", error);
    return {
      success: false,
      message: "Failed to sign out",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

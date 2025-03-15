"use server";

import fs from "fs";
import path from "path";
import type { EventReminder } from "@/lib/types";

// In a real application, you would use a database instead of a JSON file
const DATA_FILE = path.join(process.cwd(), "data", "reminders.json");

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

export async function saveReminders(reminders: EventReminder[]) {
  try {
    ensureDataDirectory();

    // Read existing data
    let existingData: EventReminder[] = [];
    try {
      const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty array
      existingData = [];
    }

    // Add new reminders with timestamps
    const newReminders = reminders.map((reminder) => ({
      ...reminder,
      createdAt: new Date().toISOString(),
    }));

    // Combine existing and new data
    const updatedData = [...existingData, ...newReminders];

    // Write back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2));

    return { success: true };
  } catch (error) {
    console.error("Error saving reminders:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to save reminders",
    };
  }
}

import mongoose from "mongoose";

// Debug MongoDB connection status
let isConnected = false;

// Define the shape of our cached connection
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Extend the global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

export function getConnectionStatus() {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    status:
      ["disconnected", "connected", "connecting", "disconnecting"][
        mongoose.connection.readyState
      ] || "unknown",
  };
}

// Validate environment variable
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing in environment variables!");
  throw new Error("Please add your MongoDB URI to .env.local");
}

console.log("MongoDB URI configuration found");
console.log(
  `MongoDB URI starts with: ${process.env.MONGODB_URI.substring(0, 20)}...`
);

// Initialize cache with type checking
let cached: MongooseCache = global.mongoose;

if (!cached) {
  console.log("Initializing MongoDB connection cache");
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  console.log("connectToDatabase called");
  console.log("Connection status:", getConnectionStatus());

  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds (default is 30s)
      socketTimeoutMS: 45000, // 45 seconds
    };

    console.log("Creating new MongoDB connection promise");
    console.log("MongoDB connection options:", JSON.stringify(opts));

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully!");
        isConnected = true;
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);

        if (error.name === "MongooseServerSelectionError") {
          console.error(
            "Could not connect to MongoDB server. Possible reasons:"
          );
          console.error(
            "1. Your IP address is not whitelisted in MongoDB Atlas"
          );
          console.error("2. Network connectivity issues");
          console.error("3. MongoDB Atlas service might be down");
          console.error("4. Incorrect connection string");
        }

        if (
          error.name === "MongooseError" &&
          error.message.includes("authentication")
        ) {
          console.error(
            "MongoDB authentication failed. Check your username and password in the connection string."
          );
        }

        cached.promise = null;
        throw error;
      });
  } else {
    console.log("Using existing MongoDB connection promise");
  }

  try {
    console.log("Awaiting MongoDB connection...");
    cached.conn = await cached.promise;
    console.log("MongoDB connection established successfully");
    return cached.conn;
  } catch (error) {
    console.error("Error while awaiting MongoDB connection:", error);
    cached.conn = null;
    cached.promise = null;

    console.error("\n--- DEBUGGING STEPS FOR MONGODB CONNECTION ---");
    console.error("1. Check if your MongoDB URI is correct in .env.local");
    console.error("2. Ensure your IP is whitelisted in MongoDB Atlas");
    console.error("3. Try connecting to MongoDB Atlas from another tool");
    console.error("4. Check your network connection");
    console.error("5. Verify that MongoDB Atlas is not experiencing an outage");
    console.error("-----------------------------------------------\n");

    throw error;
  }
}

// Test connection function with proper return type
export async function testDatabaseConnection(): Promise<{
  success: boolean;
  message: string;
  error?: unknown;
}> {
  try {
    console.log("Testing database connection...");
    await connectToDatabase();
    console.log("Database connection test successful!");
    return { success: true, message: "Connected to MongoDB successfully" };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      error,
    };
  }
}

export default connectToDatabase;

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing in environment variables!");
  throw new Error("Please add your MongoDB URI to .env.local");
}

console.log("MongoDB client: URI configuration found");

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

console.log("MongoDB client options:", JSON.stringify(options));

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  console.log("MongoDB client: Using development mode with global variable");
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log("MongoDB client: Creating new client in development mode");
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client
      .connect()
      .then((client) => {
        console.log(
          "MongoDB client connected successfully in development mode"
        );
        return client;
      })
      .catch((err) => {
        console.error(
          "MongoDB client connection error in development mode:",
          err
        );
        throw err;
      });
  } else {
    console.log("MongoDB client: Using existing client from global variable");
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log("MongoDB client: Using production mode");
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then((client) => {
      console.log("MongoDB client connected successfully in production mode");
      return client;
    })
    .catch((err) => {
      console.error("MongoDB client connection error in production mode:", err);
      throw err;
    });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

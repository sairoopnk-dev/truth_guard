import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your .env file"
  );
}

// In development, reuse the cached client across hot-reloads to
// prevent exhausting the MongoDB connection pool.
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Returns a promise that resolves to a connected MongoClient.
 * Import this helper in API routes / server actions.
 *
 * @returns {Promise<MongoClient>}
 */
export default clientPromise;

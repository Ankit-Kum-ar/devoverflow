import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";
import "@/database";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Cache the connection for the server action calls to avoid creating multiple connections
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null; // To handle concurrent calls to connect before the connection is established
}

// Define a global variable to store the cached connection
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose; // this line means that we are trying to access the global variable mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }; // if the global variable mongoose is not defined, we initialize it with an object that has conn and promise properties
}

// Function to connect to MongoDB
const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using cached MongoDB connection");
    return cached.conn; // If a connection is already established, return it
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI)
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise; // Wait for the connection to be established and cache it
  return cached.conn; // Return the established connection
};

export default dbConnect;

import client from "./RedisClient.js";
import { Exercise } from "../models/exercises.model.js";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const redisccacher = async (userId) => {
  try {
    // Define the TTL (Time-to-Live) in seconds (e.g., 1 hour = 3600 seconds)
    const ttl = 3600;  // 1 hour in seconds

    // Create an array of promises to run in parallel
    const cachePromises = days.map(async (day) => {
      const exercises = await Exercise.find({ userId, day });
      if (exercises.length === 0) return; // Skip if no exercises

      const key = `exercises:${userId}:${day}`;

      // Set the key in Redis with a TTL using 'EX' for expiration in seconds
      await client.set(key, JSON.stringify(exercises), 'EX', ttl);
    });

    // Wait for all cache updates to finish in parallel
    await Promise.all(cachePromises);

    return true; // success
  } catch (error) {
    console.error("Redis caching error:", error);
    return false; // failure
  }
};

export { redisccacher };

import client from "./RedisClient.js";
import { Exercise } from "../models/exercises.model.js";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const redisccacher = async (userId) => {
  try {
    const ttl = 300;

    // Handle all exercises
    const allExercises = await Exercise.find({ userId });
    const mainKey = `exercises:${userId}`;

    if (allExercises.length === 0) {
      console.log(`No exercises for user ${userId}. Deleting main key.`);
      await client.del(mainKey);
    } else {
      console.log(`Setting main key for user ${userId}`);
      await client.set(mainKey, JSON.stringify(allExercises), 'EX', ttl);
    }

    // Handle day-wise cache cleanup
    const cachePromises = days.map(async (day) => {
      const dayExercises = allExercises.filter(e => e.day === day); // Filter instead of refetch

      const key = `exercises:${userId}:${day}`;

      if (dayExercises.length === 0) {
        console.log(`No exercises for ${day}. Deleting ${key}`);
        return client.del(key);
      }

      console.log(`Setting cache for ${key} with ${dayExercises.length} exercises`);
      return client.set(key, JSON.stringify(dayExercises), 'EX', ttl);
    });

    await Promise.all(cachePromises);

    return true;
  } catch (error) {
    console.error("Redis caching error:", error);
    return false;
  }
};

export { redisccacher };

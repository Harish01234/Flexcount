import { Exercise } from "../models/exercises.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { exerciseSchema } from "../schema/exercise.schema.js";
import { redisccacher } from "../utils/RedisCacherFunction.js";
import client from "../utils/RedisClient.js";

const addExercise = asyncHandler(async (req, res) => {
  // Validate input using Zod
  const parsedData = exerciseSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json(new ApiResponse(400, null, parsedData.error.issues));
  }

  const { userId, name, day, sets } = parsedData.data;

  const exercise = await Exercise.create({ userId, name, day, sets });

  const cached=await redisccacher(userId);

  return res.status(201).json(new ApiResponse(201, exercise, "Exercise added successfully"));
});

const deleteExercise = asyncHandler(async (req, res) => {
  const { id } = req.params; // Remove userId from destructuring

  const exercise = await Exercise.findById(id);

  if (!exercise) {
    return res.status(404).json(new ApiResponse(404, null, "Exercise not found"));
  }

  await Exercise.findByIdAndDelete(id);

  // Use exercise.userId instead of req.params.userId
  await redisccacher(exercise.userId);

  return res.status(200).json(new ApiResponse(200, exercise, "Exercise deleted successfully"));
});

const updateExercise = asyncHandler(async (req, res) => {
  const { id,userId } = req.params;
  const { name, day } = req.body;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Missing exercise ID"));
  }

  const exercise = await Exercise.findById(id);
  if (!exercise) {
    return res.status(404).json(new ApiResponse(404, null, "Exercise not found"));
  }

  if (name) exercise.name = name;
  if (day) exercise.day = day;

  await exercise.save();

   const cached=await redisccacher(userId);

  return res.status(200).json(new ApiResponse(200, exercise, "Exercise updated successfully"));
});



const getExercisesByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const ttl=300

  // Check if the exercises are already cached in Redis
  const cachedData = await client.get(`exercises:${userId}`);
  
  if (cachedData) {
    // If data is found in cache, return the cached data
    console.log("Cache hit");
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(cachedData), "Exercises fetched from cache"));
  }

  // If data is not in cache, fetch it from the database
  const exercises = await Exercise.find({ userId });

  if (!exercises || exercises.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No exercises found for this user"));
  }

  // Cache the fetched data in Redis with a TTL of 1 hour (3600 seconds)
  await client.set(`exercises:${userId}`, JSON.stringify(exercises), 'EX', ttl);

  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises fetched successfully"));
});

const getExercisesByUserAndDay = asyncHandler(async (req, res) => {
  const { userId, day } = req.params;

   // Check if the data is cached in Redis
  const cachedExercises = await client.get(`exercises:${userId}:${day}`);
  
  if (cachedExercises) {
    // If data is in cache, return it directly
    return res
      .status(200)
      .json(new ApiResponse(200, JSON.parse(cachedExercises), "Exercises fetched from cache"));
  }

  const exercises = await Exercise.find({ userId, day });

  if (!exercises || exercises.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No exercises found for this user on this day"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, exercises, "Exercises fetched successfully"));
});





export { addExercise , deleteExercise, updateExercise,getExercisesByUser,getExercisesByUserAndDay};



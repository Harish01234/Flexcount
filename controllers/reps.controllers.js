import { Exercise} from "../models/exercises.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { exerciseSchema, setSchema } from "../schema/exercise.schema.js";
import { redisccacher } from "../utils/RedisCacherFunction.js";
import client from "../utils/RedisClient.js";


const addset=asyncHandler(async (req, res) => {
    
    const { id,userId } = req.params;
    // Validate input using Zod
    const parsedData = setSchema.safeParse(req.body);
    const exercise=await Exercise.findById(id);
    if(!exercise){
        return res.status(404).json(new ApiResponse(404, null, "Exercise not found"));
    }

    if (!parsedData.success) {
        return res.status(400).json(new ApiResponse(400, null, parsedData.error.issues));
      }
    const { reps, weight } = parsedData.data;
    exercise.sets.push({reps, weight});
    await exercise.save();

    const cached=await redisccacher(userId);


    return res.status(201).json(new ApiResponse(201, exercise, "Set added successfully"));
    


});


const deleteset=asyncHandler(async (req, res) => {
    // Validate input using Zod
    
    const { userId,id, setId } = req.params;
    const exercise=await Exercise.findById(id);
    if(!exercise){
        return res.status(404).json(new ApiResponse(404, null, "Exercise not found"));
    }
    exercise.sets.pull(setId);
    await exercise.save();

    const cached=await redisccacher(userId);
    return res.status(200).json(new ApiResponse(200, exercise, "Set deleted successfully"));


    
});
const updateset = asyncHandler(async (req, res) => {
    const parsedData = setSchema.safeParse(req.body);
    const {userId, id, setId } = req.params;
  
    if (!parsedData.success) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, parsedData.error.issues));
    }
  
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Exercise not found"));
    }
  
    const set = exercise.sets.id(setId);
    if (!set) {
      return res.status(404).json(new ApiResponse(404, null, "Set not found"));
    }
  
    const { reps, weight } = parsedData.data;
    set.reps = reps;
    set.weight = weight;
  
    await exercise.save();

    const cached=await redisccacher(userId);
  
    return res
      .status(200)
      .json(new ApiResponse(200, exercise, "Set updated successfully"));
  });
  


export { addset, deleteset, updateset};

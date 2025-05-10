// validators/exerciseSchema.js
import { z } from 'zod';

export const setSchema = z.object({
  reps: z.number().min(1, "Reps must be at least 1"),
  weight: z.number().min(0, "Weight must be 0 or more"),
});

export const exerciseSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Exercise name is required"),
  day: z.enum([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]),
  sets: z.array(setSchema).optional().default([]), // 👈 allows no sets at start
});

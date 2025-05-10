import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String, // This comes from Clerk
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  sets: [setSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export const Exercise = mongoose.model('Exercise', exerciseSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Mongoose workout schema
const WorkoutSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: [String], // Array of strings
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one workout type is required",
      },
      required: true,
    },
    category: {
      type: [String], // Array of strings
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one category is required",
      },
      required: true,
    },
    muscle_groups: {
      type: [String], // Array of strings
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one muscle group is required",
      },
      required: true,
    },
    difficulty_level: {
      type: String,
      required: [true, "Difficulty level is required"],
    },
    equipment: {
      type: [String], // Array of strings
      required: [true, "Equipment information is required"],
    },
    duration_min: {
      type: Number,
      min: [1, "Duration must be a positive number"],
      required: [true, "Duration is required"],
    },
    calories_burned_per_min: {
      type: Number,
      min: [1, "Calories burned per minute must be a positive number"],
      required: [true, "Calories burned per minute is required"],
    },
    sets: {
      type: Number,
      min: [1, "Number of sets must be a positive integer"],
      required: [true, "Number of sets is required"],
    },
    reps: {
      type: Number,
      min: [1, "Number of reps must be a positive integer"],
      required: [true, "Number of reps is required"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Define the Workout model
const Workout =
  mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);

export default Workout;

const User = require("@/db/models/User");
const Workout = require("@/db/models/Workout");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Workout Plan Schema
const WorkoutPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    days: [
      {
        day: {
          type: String,
          required: true,
        },
        workouts: [
          {
            workoutId: {
              type: Schema.Types.ObjectId,
              ref: "Workout",
              required: true,
            },
            order: {
              type: Number,
              min: [0, "Order must be a positive integer"],
              required: true,
            },
            sets: {
              type: Number,
              min: [1, "Sets must be a positive integer"],
              nullable: true,
              default: null,
            },
            reps: {
              type: Number,
              min: [1, "Reps must be a positive integer"],
              nullable: true,
              default: null,
            },
            durationMin: {
              type: Number,
              min: [1, "Duration must be a positive integer"],
              nullable: true,
              default: null,
            },
          },
        ],
      },
    ],
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      nullable: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
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

export default mongoose.models.WorkoutPlan ||
  mongoose.model("WorkoutPlan", WorkoutPlanSchema);

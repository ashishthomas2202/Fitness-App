import mongoose from "mongoose";

const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Link events to a specific user
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#8b5cf6", // Default color if not provided
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date, // For one-time events
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none", // No recurrence by default
    },
    days: [
      {
        type: String,
        enum: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ], // Days of the week for weekly recurring events
      },
    ],
    day: {
      type: Number, // For monthly recurring events (e.g., 1st, 15th)
      min: 1,
      max: 31,
    },
    start: {
      type: Date, // Start date for recurring events
    },
    end: {
      type: Date, // End date for limited recurring events
    },
    time: {
      type: String, // Time for daily/recurring events (e.g., "3:00 PM")
    },
    startTime: {
      type: String, // Start time for time-bound recurring events
    },
    endTime: {
      type: String, // End time for time-bound recurring events
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically record creation date
    },
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;

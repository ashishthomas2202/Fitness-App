// src/db/models/Weight.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const WeightSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    unit: {
      type: String,
      enum: ["kg", "lbs"],
      required: [true, "Unit is required"],
      default: "lbs",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// WeightSchema.index({ userId: 1, date: 1 });

const Weight = mongoose.models.Weight || mongoose.model("Weight", WeightSchema);

export default Weight;

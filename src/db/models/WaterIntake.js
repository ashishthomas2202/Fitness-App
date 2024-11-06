// src/db/models/WaterIntake.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const WaterIntakeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Water intake amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    unit: {
      type: String,
      enum: ["ml", "oz"],
      default: "oz",
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

// WaterIntakeSchema.index({ userId: 1, date: 1 });
const WaterIntake =
  mongoose.models.WaterIntake ||
  mongoose.model("WaterIntake", WaterIntakeSchema);

export default WaterIntake;

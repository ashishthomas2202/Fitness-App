import mongoose from "mongoose";
const { Schema } = mongoose;

const DistanceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
      min: [0, "Distance cannot be negative"],
    },
    unit: {
      type: String,
      enum: ["km", "mi"],
      default: "mi",
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

// DistanceSchema.index({ userId: 1, date: 1 });

const Distance =
  mongoose.models.Distance || mongoose.model("Distance", DistanceSchema);

export default Distance;

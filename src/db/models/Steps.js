import mongoose from "mongoose";
const { Schema } = mongoose;

const StepsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    steps: {
      type: Number,
      required: [true, "Steps count is required"],
      min: [0, "Steps cannot be negative"],
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

// StepsSchema.index({ userId: 1, date: 1 });
const Steps = mongoose.models.Steps || mongoose.model("Steps", StepsSchema);

export default Steps;

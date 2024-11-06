import mongoose from "mongoose";
const { Schema } = mongoose;

const CaloriesIntakeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    calories: {
      type: Number,
      required: [true, "Calories intake is required"],
      min: [0, "Calories cannot be negative"],
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

// CaloriesIntakeSchema.index({ userId: 1, date: 1 });

const CaloriesIntake =
  mongoose.models.CaloriesIntake ||
  mongoose.model("CaloriesIntake", CaloriesIntakeSchema);

export default CaloriesIntake;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GoalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    calorieGoal: {
      type: Number,
      required: true,
    },
    weightGoal: {
      type: Number,
      required: true,
    },
    weightHistory: [
      {
        date: { type: Date, default: Date.now },
        weight: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
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

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);

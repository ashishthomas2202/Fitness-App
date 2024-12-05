import User from "@/db/models/User";
import Meal from "@/db/models/Meal";
// const mongoose = require("mongoose");
import mongoose from "mongoose";
const { Schema } = mongoose;

const MealPlanSchema = new Schema(
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
        meals: [
          {
            mealId: {
              type: Schema.Types.ObjectId,
              ref: "Meal",
              required: true,
            },
            mealType: {
              type: String,
              enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
            macros: {
              protein: { type: Number, default: null },
              carbs: { type: Number, default: null },
              fat: { type: Number, default: null },
            },
            calories: {
              type: Number,
              required: true,
            },
            order: {
              type: Number,
              min: [0, "Order must be a positive integer"],
              required: true,
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
      default: null,
    },
    status: {
      type: String,
      enum: ["in progress", "complete"],
      default: "in progress",
    },
    note: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#4F46E5",
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

// module.exports =
//   mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);
const MealPlan =
  mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);

export default MealPlan;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  macros: {
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
  },
  calories: {
    type: Number,
    required: true,
  },
  // Ingredients array now simplified to store strings
  ingredients: {
    type: [{
      name: { type: String },
      amount: { type: Number },
      unit: { type: String },
    }],
    required: true
  },
  steps: {
    type: [
      {
        description: { type: String, required: true },
      }],
    required: true,
  },
  preparation_time_min: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

const Meal = mongoose.models.Meal || mongoose.model("Meal", MealSchema);
export default Meal;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealPlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weekStartDate: {
    type: Date,
    required: true,
  },
  meals: [
    {
      meal: {
        type: Schema.Types.ObjectId,
        ref: "Meal", 
      },
      mealType: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);

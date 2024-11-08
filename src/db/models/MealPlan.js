const mongoose = require("mongoose");
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
                            protein: { type: Number, required: true },
                            carbs: { type: Number, required: true },
                            fat: { type: Number, required: true },
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
        },
        endDate: {
            type: Date,
            required: false,
        },
        status: {
            type: String,
            enum: ["complete", "in progress"],
            default: "in progress",
        },
        note: {
            type: String,
            default: "",
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

module.exports = mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);

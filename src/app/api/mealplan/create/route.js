import MealPlan from "@/db/models/MealPlan";
import Achievement from "@/db/models/Achievement"; // Ensure this import is added
import UserAchievement from "@/db/models/UserAchievement";
import connectDB from "@/db/db";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

// Define meal, day, and meal plan schemas
const mealSchema = yup.object().shape({
    mealId: yup.string().required("Meal ID is required"),
    mealType: yup
        .string()
        .oneOf(["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"])
        .required("Meal type is required"),
    name: yup.string().required("Meal name is required"),
    macros: yup
        .object()
        .shape({
            protein: yup.number().nullable(),
            carbs: yup.number().nullable(),
            fat: yup.number().nullable(),
        })
        .required("Macros are required"),
    calories: yup.number().required("Calories are required"),
    order: yup
        .number()
        .min(0, "Order must be a positive integer")
        .required("Order is required"),
});

const daySchema = yup.object().shape({
    day: yup.string().required("Day is required"),
    meals: yup
        .array()
        .of(mealSchema)
        .required("Meals must be an array and cannot be empty"),
});

const mealPlanSchema = yup.object().shape({
    planName: yup.string().required("Plan name is required"),
    days: yup
        .array()
        .of(daySchema)
        .required("Days must be an array and cannot be empty"),
    status: yup.string().oneOf(["in progress", "complete"]).default("in progress"),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().nullable(),
    note: yup.string(),
    color: yup.string().required("Color is required"),
});

export async function POST(req) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return Response.json(
                { success: false, message: "Unauthorized User" },
                { status: 401 }
            );
        }

        const jsonData = await req.json();

        // Validate the request body with Yup
        const { isValid, validatedData, errors } = await validateMealPlanData(
            jsonData
        );

        if (!isValid) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors,
                },
                { status: 400 }
            );
        }

        const { planName, days, note, startDate, endDate, color } = validatedData;

        // Check if a meal plan with the same name already exists for the user
        const existingMealPlan = await MealPlan.findOne({
            userId: currentUser.id,
            planName,
        });

        if (existingMealPlan) {
            return Response.json(
                {
                    success: false,
                    message: "Meal plan with this name already exists.",
                },
                { status: 400 }
            );
        }

        // Save the meal plan to the database
        const mealPlan = new MealPlan({
            userId: currentUser.id,
            planName,
            days,
            note,
            startDate: startDate || new Date(),
            endDate: endDate || null,
            color,
        });

        await mealPlan.save();

        // Achievement Logic
        const achievement = await Achievement.findOne({ title: "First Meal Plan" });
        if (achievement) {
            let userAchievement = await UserAchievement.findOne({
                userId: currentUser.id,
                achievementId: achievement._id,
            });

            if (!userAchievement) {
                userAchievement = new UserAchievement({
                    userId: currentUser.id,
                    achievementId: achievement._id,
                    progress: 1,
                    completed: true,
                });

                await userAchievement.save();
                console.log(
                    `Achievement "First Meal Plan" granted to user ${currentUser.id}`
                );
            } else {
                console.log("User already has the 'First Meal Plan' achievement.");
            }
        } else {
            console.log("Achievement 'First Meal Plan' not found.");
        }


        return Response.json(
            {
                success: true,
                message: "Meal plan created successfully",
                mealPlan,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating meal plan:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to create meal plan",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

async function validateMealPlanData(data) {
    try {
        await mealPlanSchema.validate(data, { abortEarly: false });
        return { isValid: true, validatedData: data, errors: null };
    } catch (error) {
        return {
            isValid: false,
            errors: error.inner.map((err) => ({
                path: err.path,
                message: err.message,
            })),
        };
    }
}

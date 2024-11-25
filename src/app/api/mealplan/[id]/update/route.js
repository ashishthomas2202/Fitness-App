import MealPlan from "@/db/models/MealPlan";
import connectDB from "@/db/db";
import * as yup from 'yup';
import { authenticatedUser } from "@/lib/user";

// Import validation schemas from create API route
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

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();

        if (!currentUser) {
            return Response.json(
                { success: false, message: "Unauthorized User" },
                { status: 401 }
            );
        }

        const { id } = params;

        if (!id) {
            return Response.json(
                {
                    success: false,
                    message: "Meal plan ID is required"
                },
                { status: 400 }
            );
        }

        const jsonData = await req.json();
        console.log("Incoming data for update:", jsonData);  // Log incoming data

        // Validate the request body with Yup
        const { isValid, validatedData, errors } = await validateMealPlanData(jsonData);
        console.log("Validation results:", { isValid, validatedData, errors });  // Log validation results

        if (!isValid) {
            return Response.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors
                },
                { status: 400 }
            );
        }

        const { planName, days, note, startDate, endDate, status, color } = validatedData;

        // Find and update the meal plan by ID
        const mealPlan = await MealPlan.findOneAndUpdate(
            { _id: id, userId: currentUser.id },
            { planName, days, note, startDate, endDate, status, color },
            { new: true, runValidators: true }
        );
        console.log("Meal plan found and updated:", mealPlan);  // Log the result of the update

        if (!mealPlan) {
            return Response.json(
                {
                    success: false,
                    message: "Meal plan not found or you are not authorized to update it",
                },
                { status: 404 }
            );
        }

        // Set other meal plans to "complete" if this one is "in progress"
        if (mealPlan.status === "in progress") {
            await MealPlan.updateMany(
                { userId: currentUser.id, _id: { $ne: mealPlan._id } },
                { status: "complete" }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Meal plan updated successfully",
                mealPlan,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating meal plan:", error);  // Log error details
        return Response.json(
            {
                success: false,
                message: "Failed to update meal plan",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


async function validateMealPlanData(data) {
    console.log("Data being validated:", data); // Log the raw payload
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

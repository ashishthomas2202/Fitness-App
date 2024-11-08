// src/app/api/mealplan/[id]/update.js
import MealPlan from "@/db/models/MealPlan";
import connectDB from "@/db/db";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

const mealSchema = yup.object().shape({
    mealId: yup.string().required("Meal ID is required"),
    mealType: yup.string().oneOf(["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"]).required(),
    order: yup.number().min(0).required(),
    // Additional fields can be validated here if needed
});

const daySchema = yup.object().shape({
    day: yup.string().required("Day is required"),
    meals: yup.array().of(mealSchema).required("Meals must be an array and cannot be empty"),
});

const mealPlanSchema = yup.object().shape({
    planName: yup.string().required("Plan name is required"),
    days: yup.array().of(daySchema).required("Days must be an array and cannot be empty"),
    status: yup.string().oneOf(["in progress", "complete"]).default("in progress"),
    note: yup.string(),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().nullable(),
});

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const currentUser = await authenticatedUser();
        if (!currentUser) return Response.json({ success: false, message: "Unauthorized User" }, { status: 401 });

        const { id } = params;
        if (!id) return Response.json({ success: false, message: "Meal plan ID is required" }, { status: 400 });

        const jsonData = await req.json();
        const { isValid, validatedData, errors } = await validateMealPlanData(jsonData);

        if (!isValid) return Response.json({ success: false, message: "Validation failed", errors }, { status: 400 });

        const { planName, days, note, startDate, endDate, status } = validatedData;
        const mealPlan = await MealPlan.findOneAndUpdate(
            { _id: id, userId: currentUser.id },
            { planName, days, note, startDate, endDate, status },
            { new: true, runValidators: true }
        );

        if (!mealPlan) {
            return Response.json({ success: false, message: "Meal plan not found or unauthorized" }, { status: 404 });
        }

        return Response.json({ success: true, message: "Meal plan updated successfully", mealPlan }, { status: 200 });
    } catch (error) {
        return Response.json({ success: false, message: "Failed to update meal plan", error: error.message }, { status: 500 });
    }
}

async function validateMealPlanData(data) {
    try {
        await mealPlanSchema.validate(data, { abortEarly: false });
        return { isValid: true, validatedData: data, errors: null };
    } catch (error) {
        return {
            isValid: false,
            errors: error.inner.map((err) => ({ path: err.path, message: err.message })),
        };
    }
}

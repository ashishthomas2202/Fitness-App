// src/app/api/mealplan/create.js
import MealPlan from "@/db/models/MealPlan";
import connectDB from "@/db/db";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

// Define meal, day, and meal plan schemas
const mealSchema = yup.object().shape({
    mealId: yup.string().required(),
    mealType: yup.string().oneOf(["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"]).required(),
    name: yup.string().required(),
    macros: yup.object().shape({
        protein: yup.number().required(),
        carbs: yup.number().required(),
        fat: yup.number().required(),
    }).required(),
    calories: yup.number().required(),
    order: yup.number().min(0).required(),
});

const daySchema = yup.object().shape({
    day: yup.string().required(),
    meals: yup.array().of(mealSchema).required(),
});

const mealPlanSchema = yup.object().shape({
    planName: yup.string().required(),
    days: yup.array().of(daySchema).required(),
    status: yup.string().oneOf(["in progress", "complete"]).default("in progress"),
    note: yup.string(),
    startDate: yup.date().required(),
    endDate: yup.date().nullable(),
});

export async function POST(req) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return Response.json({ success: false, message: "Unauthorized User" }, { status: 401 });
        }

        const jsonData = await req.json();
        const { isValid, validatedData, errors } = await validateMealPlanData(jsonData);

        if (!isValid) {
            console.log(errors); // Log validation errors
            return Response.json({ success: false, message: "Validation failed", errors }, { status: 400 });
        }

        const mealPlan = new MealPlan({
            ...validatedData,
            userId: currentUser.id,
            startDate: validatedData.startDate || new Date(),
            endDate: validatedData.endDate || null,
            status: validatedData.status || "in progress",
        });

        await mealPlan.save();
        return Response.json({ success: true, message: "Meal plan created", mealPlan }, { status: 201 });
    } catch (error) {
        return Response.json({ success: false, message: "Failed to create meal plan", error: error.message }, { status: 500 });
    }
}

async function validateMealPlanData(data) {
    try {
        await mealPlanSchema.validate(data, { abortEarly: false });
        return { isValid: true, validatedData: data, errors: null };
    } catch (error) {
        const errors = error.inner.map((err) => ({
            path: err.path,
            message: err.message
        }));

        console.log(errors); // Log errors for debugging

        return {
            isValid: false,
            errors,
        };
    }
}


import connectDB from "@/db/db";
import Meal from "@/db/models/Meal";
import * as Yup from "yup";
import { NextResponse } from "next/server";

// Define the Yup validation schema (allowing partial updates)
const updateMealSchema = Yup.object().shape({
  name: Yup.string(),
  category: Yup.string(),
  diet: Yup.array().of(Yup.string()).nullable(),

  macros: Yup.object().shape({
    protein: Yup.number(),
    carbs: Yup.number(),
    fat: Yup.number(),
  }),
  calories: Yup.number(),
  ingredients: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      amount: Yup.string(),
      unit: Yup.string().nullable(),
    })
  ),
  steps: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required(),
      })
    ),
  preparation_time_min: Yup.number(),
});

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Extract meal ID from the URL
    const body = await req.json(); // Parse the incoming request

    // Validate the incoming data using Yup (allows partial updates)
    try {
      await updateMealSchema.validate(body, { abortEarly: false });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid data", error: error.errors },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find and update the meal document in MongoDB
    const updatedMeal = await Meal.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure Yup validation runs
    });

    // Check if the meal exists
    if (!updatedMeal) {
      return NextResponse.json(
        { success: false, message: "Meal not found" },
        { status: 404 }
      );
    }

    // Respond with the updated meal
    return NextResponse.json({ success: true, data: updatedMeal }, { status: 200 });
  } catch (error) {
    console.error("Error updating meal:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update meal", error: error.message },
      { status: 500 }
    );
  }
}


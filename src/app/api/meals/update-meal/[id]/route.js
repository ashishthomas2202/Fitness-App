import * as Yup from "yup";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// Define the Yup validation schema (allowing partial updates)
const updateMealSchema = Yup.object().shape({
  name: Yup.string(),
  category: Yup.string(),
  macros: Yup.object().shape({
    protein: Yup.number(),
    carbs: Yup.number(),
    fat: Yup.number(),
  }),
  calories: Yup.number(),
  ingredients: Yup.array().of(Yup.string()),
  preparation_time_min: Yup.number(),
});

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Extract meal ID from the URL
    const body = await req.json(); // Parse the incoming request

    // Validate the incoming data using Yup (allows partial updates)
    try {
      await updateMealSchema.validate(body);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid data", error: error.errors },
        { status: 400 }
      );
    }

    // Reference to the meal document in Firestore
    const mealRef = doc(db, "meals", id);
    const mealDoc = await getDoc(mealRef);

    // Check if the meal exists
    if (!mealDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "Meal not found" },
        { status: 404 }
      );
    }

    // Update the meal document with the validated data
    const updatedData = body;
    await updateDoc(mealRef, updatedData);

    // Fetch the updated meal
    const updatedMealDoc = await getDoc(mealRef);
    const updatedMeal = updatedMealDoc.data();

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

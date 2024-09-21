import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const { id } = params; // Extract the meal ID from the URL parameters

        // Validate if the ID is provided
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Meal ID is required", error: "Missing meal ID" },
                { status: 400 }
            );
        }

        // Reference to the meal document in Firestore
        const mealRef = doc(db, "meals", id);
        const mealDoc = await getDoc(mealRef);

        // Check if the meal exists
        if (!mealDoc.exists()) {
            return NextResponse.json(
                { success: false, message: "Meal not found", error: "No meal found with the provided ID" },
                { status: 404 }
            );
        }

        // Delete the meal document
        await deleteDoc(mealRef);

        // Respond with success
        return NextResponse.json(
            { success: true, message: "Meal successfully deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting meal:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete meal", error: error.message },
            { status: 500 }
        );
    }
}

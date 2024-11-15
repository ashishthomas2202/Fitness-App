import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { authenticatedUser } from "@/lib/user";

export async function DELETE(req, { params }) {
    const { id } = params;

    if (!id) {
        return Response.json(
            { success: false, message: "Invalid meal plan ID" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        // Authenticate user
        const currentUser = await authenticatedUser();
        if (!currentUser) {
            return Response.json(
                { success: false, message: "Unauthorized User" },
                { status: 401 }
            );
        }

        // Check if the meal plan exists and belongs to the current user
        const plan = await MealPlan.findOne({ _id: id, userId: currentUser.id });
        
        if (!plan) {
            console.error("Meal plan not found for user:", currentUser.id);
            return Response.json(
                { success: false, message: "Meal plan not found" },
                { status: 404 }
            );
        }

        // Delete the meal plan
        const deletedPlan = await MealPlan.findByIdAndDelete(id);

        console.log("Deleted meal plan:", deletedPlan);

        return Response.json(
            { success: true, message: "Meal plan deleted successfully", data: deletedPlan },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting meal plan:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete meal plan",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

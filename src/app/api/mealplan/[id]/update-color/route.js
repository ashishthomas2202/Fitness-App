import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req, { params }) {
    try {
        await connectDB();

        const currentUser = await authenticatedUser();

        if (!currentUser) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized User",
                },
                { status: 401 }
            );
        }

        const { id: planId } = params;
        const { color } = await req.json();

        if (!planId) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid plan ID",
                },
                { status: 400 }
            );
        }

        // Update the color of the specified meal plan
        const updatedPlan = await MealPlan.findByIdAndUpdate(planId,{ color },);

        if (!updatedPlan) {
            return Response.json(
                {
                    success: false,
                    message: "Meal plan not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Meal plan color updated successfully",
                data: updatedPlan,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to update meal plan color",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

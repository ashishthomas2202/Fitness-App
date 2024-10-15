// pages/api/mealplan.js
import connectDB from "@/db/db";
import MealPlan from "@/db/models/MealPlan";

export async function GET(req) {
    await connectDB();

    try {
        // Assuming user authentication is handled, and you have session details
        const session = await getServerSession(req);

        if (!session || !session.user) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
                status: 401,
            });
        }

        // Ensure the user ID is valid and fetch the meal plan for the user
        const userId = session.user.id;

        // Find the meal plan for the user and populate meal details
        const mealPlan = await MealPlan.find({ userId }).populate('meals.mealId');

        if (!mealPlan) {
            return new Response(JSON.stringify({ success: false, message: "Meal plan not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ success: true, data: mealPlan }), { status: 200 });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
            status: 500,
        });
    }
}

import connectDB from "@/db/db";
import Meal from "@/db/models/Meal";

export async function GET(req) {
    try {
        await connectDB();
        const meals = await Meal.find({});

        return Response.json(
            {
                success: true,
                data: meals,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching meals:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to fetch meals",
            },
            { status: 500 }
        );
    }
}
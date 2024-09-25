import { connectDB } from "@/db/db";
import Meal from "@/db/models/Meal";

export async function DELETE(req, { params }) {
    const { id } = params;

    if (!id) {
        return Response.json(
            {
                success: false,
                message: "Meal ID is required",
            },
            { status: 400 }
        );
    }

    console.log("Deleting meal with ID:", id);

    try {
        await connectDB();
        const meal = await Meal.findByIdAndDelete(id);

        if (!meal) {
            return Response.json(
                {
                    success: false,
                    message: "Meal not found"
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Meal deleted",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting meal:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to delete meal",
            },
            { status: 500 }
        );
    }
}

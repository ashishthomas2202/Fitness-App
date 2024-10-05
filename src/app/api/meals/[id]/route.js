import connectDB from "@/db/db";
import Meal from "@/db/models/Meal";

export const revalidate = 60;
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectDB();

    // Fetch the meal by its MongoDB _id
    const meal = await Meal.findById(id);

    // If the meal doesn't exist, return a 404 error
    if (!meal) {
      return new Response(
        JSON.stringify({ success: false, message: "Meal not found" }),
        { status: 404 }
      );
    }

    // Return the meal data if found
    return new Response(
      JSON.stringify({
        success: true,
        data: meal,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching meal:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to fetch meal",
      }),
      { status: 500 }
    );
  }
}

import connectDB from "@/db/db";
import GoalHistory from "@/db/models/GoalHistory";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const { goals } = await req.json();
    if (!Array.isArray(goals)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid data format" }),
        { status: 400 }
      );
    }

    const completedGoals = await Promise.all(
      goals.map(async (goal) => {
        const existingGoal = await GoalHistory.findOne({
          userId: currentUser.id,
          name: goal.name,
          completedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // Check if logged today
        });

        if (!existingGoal) {
          return {
            userId: currentUser.id,
            ...goal,
            completedAt: goal.completedAt || new Date(),
          };
        }
        return null;
      })
    );

    const filteredGoals = completedGoals.filter((goal) => goal !== null);

    if (filteredGoals.length > 0) {
      const history = await GoalHistory.insertMany(filteredGoals);
      return new Response(JSON.stringify({ success: true, data: history }), {
        status: 201,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "No new goals to log" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to add goal history:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

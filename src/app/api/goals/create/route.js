import connectDB from "@/db/db";
import Goal from "@/db/models/Goal";

export async function POST(req) {
    await connectDB();
    try {
        const { userId, calorieGoal, weightGoal } = await req.json();

        if (!userId || calorieGoal === undefined || weightGoal === undefined) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const newGoal = await Goal.create({
            userId,
            calorieGoal,
            weightGoal,
            weightHistory: [],
        });
        return new Response(JSON.stringify({ success: true, data: newGoal }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

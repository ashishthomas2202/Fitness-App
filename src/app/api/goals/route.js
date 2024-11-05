import connectDB from "@/db/db";
import Goal from "@/db/models/Goal";

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    try {
        const goals = await Goal.find({ userId });
        return new Response(JSON.stringify({ success: true, data: goals }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

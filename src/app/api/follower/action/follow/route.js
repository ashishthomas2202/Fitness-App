import connectDB from "@/db/db";
import Follower from "@/db/models/Follower";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to follow" },
        { status: 401 }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if already following
    const following = await Follower.findOne({
      userId: userId,
      follower: currentUser.id,
    });

    if (following) {
      return Response.json(
        { success: false, message: "Already following this user" },
        { status: 400 }
      );
    }

    // Create a new follow relationship
    await Follower.create({
      userId: userId,
      follower: currentUser.id,
    });

    return Response.json(
      { success: true, message: "Followed successfully", data: following },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch followers",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

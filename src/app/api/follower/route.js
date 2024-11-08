import connectDB from "@/db/db";
import Follower from "@/db/models/Follower";
import { authenticatedUser } from "@/lib/user";
// not sure
export async function GET(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to view followers" },
        { status: 401 }
      );
    }

    // Find all followers for the authenticated user
    const followers = await Follower.find({ userId: currentUser.id });

    return Response.json(
      {
        success: true,
        message: "Followers fetched successfully",
        data: followers,
      },
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

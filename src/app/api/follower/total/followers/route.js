import connectDB from "@/db/db";
import Follower from "@/db/models/Follower";
import { authenticatedUser } from "@/lib/user";

export async function GET(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Please sign in to view followers",
        },
        { status: 401 }
      );
    }

    const totalFollowers = await Follower.countDocuments({
      following: currentUser.id,
    });

    return Response.json(
      {
        success: true,
        message: "Followers fetched successfully",
        data: totalFollowers,
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

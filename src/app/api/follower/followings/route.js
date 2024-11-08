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
          message: "Please sign in to view followings",
        },
        { status: 401 }
      );
    }

    const followings = await Follower.find({
      follower: currentUser.id,
    }).select("userId");

    const formattedFollowings = followings.map((following) => following.userId);
    return Response.json(
      {
        success: true,
        message: "Followings fetched successfully",
        data: formattedFollowings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch followings",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

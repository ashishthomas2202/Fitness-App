import connectDB from "@/db/db";
import Follower from "@/db/models/Follower";
import Post from "@/db/models/Post";
import { authenticatedUser } from "@/lib/user";

export async function GET(params) {
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

    const totalFollowings = await Follower.countDocuments({
      follower: currentUser.id,
    });
    const totalFollowers = await Follower.countDocuments({
      userId: currentUser.id,
    });

    const totalPosts = await Post.countDocuments({ author: currentUser.id });

    return Response.json(
      {
        success: true,
        message: "Followers fetched successfully",
        data: {
          followers: totalFollowers,
          followings: totalFollowings,
          posts: totalPosts,
        },
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

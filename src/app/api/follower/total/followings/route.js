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

    // const totalFollowings = await Follower.countDocuments({
    //   userId: currentUser.id,
    // });
    const totalFollowings = await Follower.countDocuments({
      follower: currentUser.id,
    });

    return Response.json(
      {
        success: true,
        message: "Followings fetched successfully",
        data: totalFollowings,
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

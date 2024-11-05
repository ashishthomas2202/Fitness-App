import connectDB from "@/db/db";
import Follower from "@/db/models/Follower";
import { authenticatedUser } from "@/lib/user";
import { data } from "autoprefixer";

export async function DELETE(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to unfollow" },
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

    // Check if the follow relationship exists
    const following = await Follower.findOne({
      userId: userId,
      follower: currentUser.id,
    });

    if (!following) {
      return Response.json(
        { success: false, message: "You are not following this user" },
        { status: 400 }
      );
    }

    // Delete the follow relationship
    await Follower.findOneAndDelete({
      userId: userId,
      follower: currentUser.id,
    });

    return Response.json(
      {
        success: true,
        message: "User unfollowed successfully",
        data: following,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to unfollow user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

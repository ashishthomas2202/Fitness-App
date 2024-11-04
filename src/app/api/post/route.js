import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import Post from "@/db/models/Post";

export async function GET(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Please sign in to view posts",
        },
        { status: 401 }
      );
    }
    //TODO: Add followers posts
    const posts = await Post.find({
      $or: [{ visibility: "public" }, { author: currentUser.id }],
    })
      .populate({
        path: "author",
        select: "firstName lastName email",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      })
      //   .populate({
      //     path: "comments",
      //     populate: {
      //       path: "commenter",
      //       select: "firstName lastName",
      //       populate: {
      //         path: "profile",
      //         select: "profilePicture",
      //       },
      //     },
      //   })
      .sort({ createdAt: -1 });
    return Response.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

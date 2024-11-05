import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import Post, { Comment } from "@/db/models/Post";

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
      .sort({ createdAt: -1 })
      .lean({
        virtuals: true,
      });

    // Add `id` key to each post object
    posts.forEach((post) => {
      post.id = post._id.toString(); // Add `id` using `_id`
    });

    // Fetch total comment counts for each post
    const postIds = posts.map((post) => post._id);

    const commentsCount = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      {
        $group: {
          _id: "$postId",
          totalComments: { $sum: 1 }, // Count only the comments with `postId`
        },
      },
    ]);

    // Create a lookup dictionary for easy access
    const commentsCountMap = commentsCount.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalComments;
      return acc;
    }, {});

    // Add total comments to each post
    posts.forEach((post) => {
      post.totalComments = commentsCountMap[post._id.toString()] || 0;
    });

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

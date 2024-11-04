import connectDB from "@/db/db";
import Post from "@/db/models/Post";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req, { params }) {
  const postId = params?.postId;

  try {
    await connectDB();
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to like a post" },
        { status: 401 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.includes(currentUser.id);

    if (hasLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== currentUser.id
      );
    } else {
      // Add like
      post.likes.push(currentUser.id);
    }

    // Save the updated post
    await post.save();

    return Response.json(
      {
        success: true,
        message: hasLiked ? "Like removed" : "Like added",
        data: post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update likes",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

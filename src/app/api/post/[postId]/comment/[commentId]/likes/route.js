import connectDB from "@/db/db";
import Post, { Comment } from "@/db/models/Post";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req, { params }) {
  const postId = params?.postId;
  const commentId = params?.commentId;

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

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return Response.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    console.log(post);
    console.log(comment);
    // Check if the user already liked the comment
    const hasLiked = comment.likes.includes(currentUser.id);

    if (hasLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== currentUser.id
      );
    } else {
      // Add like
      comment.likes.push(currentUser.id);
    }

    // Save the updated post
    await comment.save();

    return Response.json(
      {
        success: true,
        message: hasLiked ? "Like removed" : "Like added",
        data: comment,
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

import connectDB from "@/db/db";
import Post, { Comment } from "@/db/models/Post";

export async function DELETE(req, { params }) {
  const postId = params?.postId;
  const commentId = params?.commentId;

  try {
    await connectDB(); // Connect to the database

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Find the comment to delete
    const commentToDelete = await Comment.findById(commentId);
    if (!commentToDelete) {
      return Response.json(
        {
          success: false,
          message: "Comment not found",
        },
        { status: 404 }
      );
    }

    // Collect all IDs to delete: commentId + all replies
    const commentsToDelete = [commentId, ...commentToDelete.replies];

    // Delete the main comment and its replies
    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    // Remove the comment ID from the post's comments list
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    return Response.json(
      {
        success: true,
        message: "Comment and replies deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete comment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

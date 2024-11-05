import connectDB from "@/db/db";
import Post, { Comment } from "@/db/models/Post";
import { authenticatedUser } from "@/lib/user";

export async function DELETE(req, { params }) {
  const postId = params?.postId;

  try {
    await connectDB(); // Connect to the database

    const currentUser = await authenticatedUser(); // Get the current user

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Please sign in to delete a post",
        },
        { status: 401 }
      );
    }

    // const deletedPost = await Post.findByIdAndDelete(postId);
    const postToDelete = await Post.findById(postId);

    if (!postToDelete) {
      return Response.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Check if the current user is the author of the post
    if (postToDelete.author.toString() !== currentUser.id) {
      return Response.json(
        {
          success: false,
          message: "You are not authorized to delete this post",
        },
        { status: 403 }
      );
    }

    const deletedComments = await Comment.deleteMany({ postId }).exec();

    // TODO: Delete post image from IMAGEKIT

    await postToDelete.deleteOne();

    return Response.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

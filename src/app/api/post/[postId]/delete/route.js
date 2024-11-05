import connectDB from "@/db/db";
import Post from "@/db/models/Post";

export async function DELETE(req, { params }) {
  const postId = params?.postId;

  try {
    await connectDB(); // Connect to the database

    const deletedPost = await Post.findByIdAndDelete(postId);

    // TODO: Delete post image from IMAGEKIT
    if (!deletedPost) {
      return Response.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

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

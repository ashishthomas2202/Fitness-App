import connectDB from "@/db/db";
import { Post, Comment } from "@/db/models/Post";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

export async function GET(req, { params }) {
  const { postId } = params;

  try {
    await connectDB();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!postId) {
      return Response.json(
        {
          success: false,
          message: "Post ID is required",
        },
        { status: 400 }
      );
    }

    // Populate the post, including all nested replies in comments
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: [
        {
          path: "commenter",
          select: "firstName lastName email",
          populate: { path: "profile", select: "profilePicture" },
        },
        {
          path: "replies",
          populate: {
            path: "commenter",
            select: "firstName lastName email",
            populate: { path: "profile", select: "profilePicture" },
          },
        },
      ],
    });

    for (let comment of post.comments) {
      await populateReplies(comment);
    }

    return Response.json(
      {
        success: true,
        message: "Comments fetched successfully",
        data: post.comments,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to add reply",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function populateReplies(comment) {
  await comment.populate({
    path: "commenter",
    select: "firstName lastName email",
    populate: { path: "profile", select: "profilePicture" },
  });

  await comment.populate({
    path: "replies",
  });

  // Recursively populate each reply
  for (let reply of comment.replies) {
    await populateReplies(reply);
  }
}

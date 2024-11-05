import connectDB from "@/db/db";
import { Post, Comment } from "@/db/models/Post";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

// Recursive Yup schema for comment validation
const commentSchema = yup.object().shape({
  commenter: yup.string().required("Commenter is required"),
  comment: yup.string().required("Comment text is required"),
  replies: yup.array().of(yup.lazy(() => commentSchema.default(undefined))),
  likes: yup.array().of(yup.string()),
});

// Validation function for comments
async function validateCommentData(data) {
  try {
    await commentSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
}

// POST request handler for adding comments or replies to a post
export async function POST(req, { params }) {
  const postId = params?.postId;

  try {
    await connectDB();
    const { commentText } = await req.json();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to comment" },
        { status: 401 }
      );
    }

    if (!postId || !commentText) {
      return Response.json(
        { success: false, message: "Post ID and comment text are required" },
        { status: 400 }
      );
    }

    const newCommentData = {
      commenter: currentUser.id,
      comment: commentText,
      replies: [],
      likes: [],
      postId,
    };

    // Validate the comment data
    const { isValid, errors } = await validateCommentData(newCommentData);

    if (!isValid) {
      return Response.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Create and save the new comment
    const newComment = await Comment.create(newCommentData);

    // if (parentId) {
    //   // Handle replies by finding the parent comment and updating its replies array
    //   const parentComment = await Comment.findById(parentId);
    //   if (!parentComment) {
    //     return Response.json(
    //       { success: false, message: "Parent comment not found" },
    //       { status: 404 }
    //     );
    //   }

    //   parentComment.replies.push(newComment._id);
    //   await parentComment.save();
    // } else {
    // If it’s a top-level comment, add it to the post
    const post = await Post.findById(postId);
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    post.comments.push(newComment._id);
    await post.save();

    await newComment.populate({
      path: "commenter",
      select: "firstName lastName email",
      populate: { path: "profile", select: "profilePicture" },
    });
    // await post.populate({
    //   path: "comments",
    //   populate: {
    //     path: "commenter",
    //     select: "firstName lastName email",
    //     populate: { path: "profile", select: "profilePicture" },
    //   },
    // });
    // }

    return Response.json(
      {
        success: true,
        message: "Comment added successfully",
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to add comment",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import connectDB from "@/db/db";
import { Post, Comment } from "@/db/models/Post";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";

// Recursive Yup schema for comment validation
const replySchema = yup.object().shape({
  commenter: yup.string().required("Commenter is required"),
  comment: yup.string().required("Reply text is required"),
  replies: yup.array().of(yup.lazy(() => replySchema.default(undefined))),
  likes: yup.array().of(yup.string()),
});

// Validation function for replies
async function validateReplyData(data) {
  try {
    await replySchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: null };
  } catch (error) {
    return { isValid: false, errors: error.errors };
  }
}

// POST request handler for adding replies to a comment
export async function POST(req, { params }) {
  const { postId, commentId } = params;

  try {
    await connectDB();
    const { replyText } = await req.json();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Please sign in to reply" },
        { status: 401 }
      );
    }

    if (!postId || !commentId || !replyText) {
      return Response.json(
        {
          success: false,
          message: "Post ID, Comment ID, and reply text are required",
        },
        { status: 400 }
      );
    }

    const newReplyData = {
      commenter: currentUser.id,
      comment: replyText,
      replies: [],
      likes: [],
      postId,
    };

    // Validate the reply data
    const { isValid, errors } = await validateReplyData(newReplyData);

    if (!isValid) {
      return Response.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Create and save the new reply
    const newReply = await Comment.create(newReplyData);

    // Find the parent comment to add the reply to
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return Response.json(
        { success: false, message: "Parent comment not found" },
        { status: 404 }
      );
    }

    // Add the reply to the parent's replies array
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    // Populate the newly added reply with user details
    await newReply.populate({
      path: "commenter",
      select: "firstName lastName email",
      populate: { path: "profile", select: "profilePicture" },
    });

    // // Populate the post, including all nested replies in comments
    // const post = await Post.findById(postId).populate({
    //   path: "comments",
    //   populate: [
    //     {
    //       path: "commenter",
    //       select: "firstName lastName email",
    //       populate: { path: "profile", select: "profilePicture" },
    //     },
    //     {
    //       path: "replies",
    //       populate: {
    //         path: "commenter",
    //         select: "firstName lastName email",
    //         populate: { path: "profile", select: "profilePicture" },
    //       },
    //     },
    //   ],
    // });

    // for (let comment of post.comments) {
    //   await populateReplies(comment);
    // }

    return Response.json(
      {
        success: true,
        message: "Reply added successfully",
        data: newReply,
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

import connectDB from "@/db/db";
import Post, { Comment } from "@/db/models/Post";
import { authenticatedUser } from "@/lib/user";
import { data } from "autoprefixer";

export async function DELETE(req, { params }) {
  const postId = params?.postId;
  const commentId = params?.commentId;

  try {
    await connectDB(); // Connect to the database

    const currentUser = await authenticatedUser(); // Get the current user

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Please sign in to delete a comment",
        },
        { status: 401 }
      );
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author.toString() !== currentUser.id) {
      return Response.json(
        {
          success: false,
          message: "You are not authorized to delete this comment",
        },
        { status: 403 }
      );
    }
    // Fetch all comments associated with the post
    const allComments = await Comment.find({ postId });
    if (!allComments || allComments.length === 0) {
      return Response.json(
        { success: false, message: "No comments found for this post" },
        { status: 404 }
      );
    }

    // Helper function to recursively find all replies to delete
    const collectReplyIds = (commentId, comments) => {
      let idsToDelete = [commentId];

      const findReplies = (replies) => {
        replies.forEach((replyId) => {
          idsToDelete.push(replyId.toString());
          const reply = comments.find(
            (comment) => comment.id === replyId.toString()
          );
          if (reply) {
            findReplies(reply.replies);
          }
        });
      };

      const mainComment = comments.find((comment) => comment.id === commentId);
      findReplies(mainComment.replies);
      return idsToDelete;
    };

    // Collect all IDs to delete, starting from the main comment ID
    const commentsToDelete = collectReplyIds(commentId, allComments);

    // Delete all comments in the collected list
    await Comment.deleteMany({ _id: { $in: commentsToDelete } });

    // Remove the main comment ID from the post's comments list if it exists
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    // Check for a parent comment containing the main comment ID in its replies
    const parentComment = allComments.find((comment) =>
      comment.replies.includes(commentId)
    );
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment._id, {
        $pull: { replies: commentId },
      });
    }

    return Response.json(
      {
        success: true,
        message: "Comment and all associated replies deleted successfully",
        data: commentsToDelete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to delete comment and replies",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// import connectDB from "@/db/db";
// import Post, { Comment } from "@/db/models/Post";

// export async function DELETE(req, { params }) {
//   const postId = params?.postId;
//   const commentId = params?.commentId;

//   try {
//     await connectDB(); // Connect to the database

//     // Find the post
//     const post = await Post.findById(postId);
//     if (!post) {
//       return Response.json(
//         { success: false, message: "Post not found" },
//         { status: 404 }
//       );
//     }

//     // Find the comment to delete
//     const commentToDelete = await Comment.findById(commentId);
//     if (!commentToDelete) {
//       return Response.json(
//         {
//           success: false,
//           message: "Comment not found",
//         },
//         { status: 404 }
//       );
//     }

//     // Collect all IDs to delete: commentId + all replies
//     const commentsToDelete = [commentId, ...commentToDelete.replies];

//     // Delete the main comment and its replies
//     await Comment.deleteMany({ _id: { $in: commentsToDelete } });

//     // Remove the comment ID from the post's comments list
//     await Post.findByIdAndUpdate(postId, {
//       $pull: { comments: commentId },
//     });

//     return Response.json(
//       {
//         success: true,
//         message: "Comment and replies deleted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to delete comment",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

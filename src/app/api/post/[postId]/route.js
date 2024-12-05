import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import Post, { Comment } from "@/db/models/Post";
import Follower from "@/db/models/Follower";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "Please sign in to view the post",
        },
        { status: 401 }
      );
    }

    // Extract postId from the request URL query params
    // const { searchParams } = new URL(req.url);
    const { postId } = params;

    if (!postId) {
      return Response.json(
        {
          success: false,
          message: "Post ID is required",
        },
        { status: 400 }
      );
    }

    // Get a list of user IDs that the authenticated user is following
    const followingList = await Follower.find({
      follower: currentUser.id,
    }).select("userId");
    const followingUserIds = followingList.map((f) => f.userId.toString());

    // Find the specific post with visibility checks
    const post = await Post.findOne({
      _id: postId,
      $or: [
        { visibility: "public" },
        {
          visibility: "private",
          author: { $in: [...followingUserIds, currentUser.id] },
        },
      ],
    })
      .populate({
        path: "author",
        select: "firstName lastName email",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      })
      .lean({
        virtuals: true,
      });

    if (!post) {
      return Response.json(
        {
          success: false,
          message: "Post not found or you do not have permission to view it",
        },
        { status: 404 }
      );
    }

    // Add `id` key to the post object
    post.id = post._id.toString();

    // Fetch total comment count for the post
    const commentsCount = await Comment.countDocuments({ postId: post._id });
    post.totalComments = commentsCount;

    return Response.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch the post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// import connectDB from "@/db/db";
// import { authenticatedUser } from "@/lib/user";
// import Post, { Comment } from "@/db/models/Post";
// import Follower from "@/db/models/Follower";

// export async function GET(req, { params }) {
//   const { postId } = params;

//   if (!postId) {
//     return Response.json(
//       {
//         success: false,
//         message: "Invalid input data",
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     await connectDB();
//     const currentUser = await authenticatedUser();
//     if (!currentUser) {
//       return Response.json(
//         {
//           success: false,
//           message: "Please sign in to view posts",
//         },
//         { status: 401 }
//       );
//     }
//     //TODO: Add followers posts

//     // Get a list of user IDs that the authenticated user is following
//     const followingList = await Follower.find({
//       follower: currentUser.id,
//     }).select("userId");
//     const followingUserIds = followingList.map((f) => f.userId.toString());

//     const posts = await Post.find({
//       // $or: [{ visibility: "public" }, { author: currentUser.id }],
//       $or: [
//         { visibility: "public" },
//         {
//           visibility: "private",
//           author: { $in: [...followingUserIds, currentUser.id] },
//         },
//       ],
//     })
//       .populate({
//         path: "author",
//         select: "firstName lastName email",
//         populate: {
//           path: "profile",
//           select: "profilePicture",
//         },
//       })
//       .sort({ createdAt: -1 })
//       .lean({
//         virtuals: true,
//       });

//     // Add `id` key to each post object
//     posts.forEach((post) => {
//       post.id = post._id.toString(); // Add `id` using `_id`
//     });

//     // Fetch total comment counts for each post
//     const postIds = posts.map((post) => post._id);

//     const commentsCount = await Comment.aggregate([
//       { $match: { postId: { $in: postIds } } },
//       {
//         $group: {
//           _id: "$postId",
//           totalComments: { $sum: 1 }, // Count only the comments with `postId`
//         },
//       },
//     ]);

//     // Create a lookup dictionary for easy access
//     const commentsCountMap = commentsCount.reduce((acc, item) => {
//       acc[item._id.toString()] = item.totalComments;
//       return acc;
//     }, {});

//     // Add total comments to each post
//     posts.forEach((post) => {
//       post.totalComments = commentsCountMap[post._id.toString()] || 0;
//     });

//     return Response.json({ success: true, data: posts });
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       {
//         success: false,
//         message: "Failed to fetch posts",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

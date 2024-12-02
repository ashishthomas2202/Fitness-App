import connectDB from "@/db/db";
import Message from "@/db/models/Message";
import User from "@/db/models/User";
import { authenticatedUser } from "@/lib/user";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // const conversations = await Message.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { sender: new mongoose.Types.ObjectId(currentUser.id) },
    //         { receiver: new mongoose.Types.ObjectId(currentUser.id) },
    //       ],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       users: {
    //         $addToSet: {
    //           $cond: [
    //             {
    //               $ne: ["$sender", new mongoose.Types.ObjectId(currentUser.id)],
    //             },
    //             "$sender",
    //             "$receiver",
    //           ],
    //         },
    //       },
    //     },
    //   },
    // ]);

    // console.log("conversations", conversations);
    // const userIds = conversations[0]?.users || [];

    // // Fetch user details for the conversation list
    // const users = await User.find({ _id: { $in: userIds } })
    //   .select("firstName lastName email profile")
    //   .populate({
    //     path: "profile",
    //     select: "profilePicture firstName lastName email",
    //   });

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUser.id) },
            { receiver: new mongoose.Types.ObjectId(currentUser.id) },
          ],
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort by latest message timestamp
      },
      {
        $group: {
          _id: {
            $cond: [
              {
                $ne: ["$sender", new mongoose.Types.ObjectId(currentUser.id)],
              },
              "$sender",
              "$receiver",
            ],
          },
          lastMessage: { $first: "$timestamp" }, // Keep the latest timestamp
        },
      },
      {
        $sort: { lastMessage: -1 }, // Sort users by latest conversation
      },
    ]);

    const userIds = conversations.map((conversation) => conversation._id);

    // Fetch user details for the conversation list
    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName email profile")
      .populate({
        path: "profile",
        select: "profilePicture firstName lastName email",
      });

    // Map the users to maintain the sorted order
    const sortedUsers = userIds.map((id) =>
      users.find((user) => user._id.toString() === id.toString())
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: sortedUsers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching conversations",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

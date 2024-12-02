import connectDB from "@/db/db";
import Message from "@/db/models/Message";
import { authenticatedUser } from "@/lib/user";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }
    const { receiverId } = params; // Receiver's user ID from the URL

    // Validate input
    if (!receiverId) {
      return new Response(
        JSON.stringify({ success: false, message: "Receiver ID is required" }),
        { status: 400 }
      );
    }

    // Fetch messages where the current user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: currentUser?.id, receiver: receiverId },
        { sender: receiverId, receiver: currentUser?.id },
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp (oldest first)

    return new Response(
      JSON.stringify({
        success: true,
        data: messages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching messages",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

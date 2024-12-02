import connectDB from "@/db/db";
import Message from "@/db/models/Message";
import { authenticatedUser } from "@/lib/user";

export async function POST(req, { params }) {
  const { receiverId } = params;
  await connectDB();

  try {
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return new Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    // Validate input
    if (!receiverId || !content.trim()) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input data" }),
        { status: 400 }
      );
    }

    // Create a new message
    const message = await Message.create({
      sender: currentUser?.id,
      receiver: receiverId,
      content: content.trim(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
        data: message,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while sending the message",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

import connectDB from "@/db/db";
import Event from "@/db/models/Event";
import { authenticatedUser } from "@/lib/user";

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

    // Fetch all events for the current user
    const events = await Event.find({ user: currentUser.id });

    // Transform events for calendar display and exclude null or unnecessary values
    const formattedEvents = events.map((event) => {
      const baseEvent = {
        name: event.name,
        color: event.color || "#8b5cf6",
        description: event.description,
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0] // Format to YYYY-MM-DD
          : null,
        repeat: event.repeat !== "none" ? event.repeat : null,
        days: event.days && event.days.length > 0 ? event.days : null,
        day: event.day,
        start: event.start
          ? new Date(event.start).toISOString().split("T")[0] // Format to YYYY-MM-DD
          : null,
        end: event.end
          ? new Date(event.end).toISOString().split("T")[0] // Format to YYYY-MM-DD
          : null,
        time: event.time,
        startTime: event.startTime,
        endTime: event.endTime,
      };

      // Remove keys with null or undefined values
      Object.keys(baseEvent).forEach((key) => {
        if (baseEvent[key] == null) {
          delete baseEvent[key];
        }
      });

      return baseEvent;
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: formattedEvents,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

import connectDB from "@/db/db";
import Event from "@/db/models/Event";
import { authenticatedUser } from "@/lib/user";

export async function POST(req) {
  try {
    await connectDB();

    // Get the authenticated user
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();

    const {
      name,
      date,
      repeat,
      days,
      day,
      start,
      end,
      time,
      startTime,
      color,
      type,
    } = body;

    // Validate required fields based on the type
    if (!name) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name is required.",
        }),
        { status: 400 }
      );
    }

    if (type === "task") {
      if (!date) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Date is required for tasks.",
          }),
          { status: 400 }
        );
      }
      if (!time) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Time is required for tasks.",
          }),
          { status: 400 }
        );
      }
    } else if (type === "event") {
      if (!start) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Start date is required for events.",
          }),
          { status: 400 }
        );
      }
      if (startTime && !color) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Color is required when providing a start time.",
          }),
          { status: 400 }
        );
      }
    }

    // Create the event/task
    const newEvent = await Event.create({
      user: currentUser.id,
      name,
      color: color || "#8b5cf6", // Default color if not provided
      date: date ? new Date(date) : undefined,
      repeat: repeat || "none",
      days: repeat === "weekly" ? days || [] : undefined,
      day: repeat === "monthly" ? day : undefined,
      start: start ? new Date(start) : undefined,
      end: end ? new Date(end) : undefined,
      time,
      startTime,
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: newEvent,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
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

// import connectDB from "@/db/db";
// import Event from "@/db/models/Event";
// import { authenticatedUser } from "@/lib/user";

// export async function POST(req) {
//   try {
//     await connectDB();

//     // Get the authenticated user
//     const currentUser = await authenticatedUser();

//     if (!currentUser) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Unauthorized" }),
//         { status: 401 }
//       );
//     }

//     // Parse request body
//     const body = await req.json();

//     // Validate required fields
//     const {
//       name,
//       date,
//       repeat,
//       days,
//       day,
//       start,
//       end,
//       time,
//       startTime,
//       endTime,
//       color,
//     } = body;

//     if (!name || (!date && !repeat)) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Name and either a date or recurrence are required.",
//         }),
//         { status: 400 }
//       );
//     }

//     // Create the event
//     const newEvent = await Event.create({
//       user: currentUser.id,
//       name,
//       color: color || "#8b5cf6", // Default color if not provided
//       date: date ? new Date(date) : undefined,
//       repeat: repeat || "none",
//       days: repeat === "weekly" ? days || [] : undefined,
//       day: repeat === "monthly" ? day : undefined,
//       start: start ? new Date(start) : undefined,
//       end: end ? new Date(end) : undefined,
//       time,
//       startTime,
//       endTime,
//     });

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: newEvent,
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating event:", error);
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "An unexpected error occurred.",
//         error: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

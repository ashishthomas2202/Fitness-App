// src/app/api/record/weight/[id]/delete/route.js
import { authenticatedUser } from "@/lib/user";
import Weight from "@/db/models/Weight";
import connectDB from "@/db/db";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const record = await Weight.findOneAndDelete({
      _id: params.id,
      userId: user.id,
    });

    if (!record) {
      return Response.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Weight record deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete weight error:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
// // src/app/api/record/weight/[id]/delete/route.js
// import { authenticatedUser } from "@/lib/user";
// import Weight from "@/db/models/Weight";
// import connectDB from "@/db/db";

// export async function DELETE(req, { params }) {
//   try {
//     await connectDB();
//     const user = await authenticatedUser();
//     if (!user) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Unauthorized User" }),
//         { status: 401 }
//       );
//     }

//     const record = await Weight.findOneAndDelete({
//       _id: params.id,
//       userId: user.id,
//     });

//     if (!record) {
//       return Response.json(
//         { success: false, message: "Record not found" },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         message: "Weight record deleted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return Response.json(
//       {
//         success: false,
//         message: "An unexpected error occurred.",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

import connectDB from "@/db/db";
import User from "@/db/models/User";
import { authenticatedUser } from "@/lib/user";

export async function PATCH(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "Unauthorized User" },
        { status: 401 }
      );
    }

    if (currentUser.userRole === "trainer") {
      return Response.json(
        { success: false, message: "User is already a trainer" },
        { status: 400 }
      );
    }

    if (currentUser.userRole === "admin") {
      return Response.json(
        { success: false, message: "Admins has access to trainer" },
        { status: 400 }
      );
    }

    currentUser.userRole = "trainer";
    await currentUser.save();

    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { userRole: "trainer" },
    //   { new: true }
    // );

    return Response.json(
      {
        success: true,
        message: "User role updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user role",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

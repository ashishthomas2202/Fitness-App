import { authenticatedUser } from "@/lib/user";
import Profile from "@/db/models/Profile";

export async function GET(req) {
  try {
    const currentUser = await authenticatedUser();
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 }
      );
    }

    // Fetching specific user data (height, weight, etc.)
    const profile = await Profile.findOne({ userId: currentUser?._id });
    if (!profile) {
      return Response.json(
        {
          success: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    const { height, weight, age, gender } = profile;

    return Response.json(
      {
        success: true,
        data: { height, weight, age, gender }, // Extracting the relevant data for calorie calculator
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch user data",
      },
      { status: 500 }
    );
  }
}

//get-profile/route.js
import { authenticatedUser } from "@/lib/user";
import Profile from "@/db/models/Profile";
import { first } from "lodash";

export const revalidate = 60;
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

    // console.log("Current user:", currentUser);

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

    const profileData = profile.toJSON();
    const userData = currentUser?.toJSON();

    const data = {
      ...profileData,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      since: userData?.createdAt,
    };
    return Response.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error fetching profile:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}

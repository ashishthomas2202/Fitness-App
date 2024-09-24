import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";
import Profile from "@/db/models/Profile";

export async function POST(req) {
  try {
    await connectDB();
    const currentUser = await authenticatedUser();
    console.log("currentUser:::", currentUser);
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    const { profilePicture } = await req.json();

    if (!profilePicture) {
      return Response.json(
        {
          success: false,
          message: "Profile picture is required",
        },
        {
          status: 400,
        }
      );
    }

    // currentUser.profilePicture = profilePicture;
    // await currentUser.save();

    const userProfile = await Profile.findOne({ userId: currentUser.id });
    if (!userProfile) {
      return Response.json(
        {
          success: false,
          message: "Profile not found",
        },
        {
          status: 404,
        }
      );
    }

    userProfile.profilePicture = profilePicture;
    await userProfile.save();

    console.log("profilePicture:::", profilePicture);

    console.log("userProfile:::", userProfile);

    return Response.json(
      {
        success: true,
        message: "Profile picture updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update profile picture",
      },
      {
        status: 500,
      }
    );
  }
}

import connectDB from "@/db/db";
import { authenticatedUser } from "@/lib/user";

export const revalidate = 60;
export async function GET() {
  try {
    await connectDB();

    const user = await authenticatedUser();
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized User",
        },
        {
          status: 401,
        }
      );
    }

    if (user.userRole !== "trainer") {
      return Response.json(
        {
          success: false,
          message: "Unauthorized User",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Authorized",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized User",
      },
      {
        status: 401,
      }
    );
  }
}

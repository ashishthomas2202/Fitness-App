import connectDB from "@/db/db";
import { authenticatedAdmin } from "@/lib/user";

export const revalidate = 60;
export async function GET() {
  try {
    await connectDB();

    const user = await authenticatedAdmin();
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

    return Response.json(
      {
        success: true,
        message: "Authorized",
        data: user,
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

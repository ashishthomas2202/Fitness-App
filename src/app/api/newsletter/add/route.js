import connectDB from "@/db/db";
import Newsletter from "@/db/models/Newsletter";

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.email) {
      return Response.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const existingEmail = await Newsletter.findOne({
      email: data.email,
    }).lean();
    if (existingEmail) {
      return Response.json(
        { success: false, message: "Email already subscribed" },
        { status: 400 }
      );
    }

    await Newsletter.create({ email: data.email });
    return Response.json({
      success: true,
      message: "Email added to newsletter",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to add email to newsletter" },
      { status: 500 }
    );
  }
}

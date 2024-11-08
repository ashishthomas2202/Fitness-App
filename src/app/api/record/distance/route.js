// src/app/api/record/distance/route.js
import { authenticatedUser } from "@/lib/user";
import Distance from "@/db/models/Distance";
import connectDB from "@/db/db";

export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const unit = searchParams.get('unit');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = { userId: user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (unit) {
      query.unit = unit;
    }

    const total = await Distance.countDocuments(query);
    const records = await Distance.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return Response.json(
      {
        success: true,
        data: records,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
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
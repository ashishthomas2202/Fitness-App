// src/app/api/measurements/route.js
import { authenticatedUser } from "@/lib/user";
import Measurement from "@/db/models/Measurement";
import connectDB from "@/db/db";

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const startOfDay = new Date(data.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data.date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Measurement.findOneAndUpdate(
      {
        userId: user.id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      {
        userId: user.id,
        ...data,
      },
      { upsert: true, new: true }
    );

    return Response.json({
      success: true,
      message: "Measurement recorded successfully",
      data: result,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;

    const measurements = await Measurement.find({ userId: user.id })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Measurement.countDocuments({ userId: user.id });

    return Response.json({
      success: true,
      data: measurements,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

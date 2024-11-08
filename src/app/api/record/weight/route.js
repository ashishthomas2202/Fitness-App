// src/app/api/record/weight/route.js
import { authenticatedUser } from "@/lib/user";
import Weight from "@/db/models/Weight";
import connectDB from "@/db/db";
import { convertWeight } from "@/utils/weightConversion";

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
    const preferredUnit = searchParams.get('unit');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = { userId: user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Weight.countDocuments(query);
    let records = await Weight.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Convert units if needed
    if (preferredUnit) {
      records = records.map(record => {
        const weightData = record.toObject();
        if (record.unit !== preferredUnit) {
          weightData.weight = preferredUnit === 'kg'
            ? convertWeight.lbsToKg(record.weight)
            : convertWeight.kgToLbs(record.weight);
          weightData.unit = preferredUnit;
        }
        return weightData;
      });
    }

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
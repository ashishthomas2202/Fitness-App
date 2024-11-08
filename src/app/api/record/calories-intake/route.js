// src/app/api/record/calories-intake/route.js
import { authenticatedUser } from "@/lib/user";
import CaloriesIntake from "@/db/models/CaloriesIntake";
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
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = { userId: user.id };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await CaloriesIntake.countDocuments(query);
    const records = await CaloriesIntake.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate total calories for the period
    const totalCalories = records.reduce((sum, record) => sum + record.calories, 0);
    
    // Calculate daily average
    const uniqueDays = new Set(records.map(record => 
      record.date.toISOString().split('T')[0]
    )).size;
    const dailyAverage = uniqueDays > 0 ? totalCalories / uniqueDays : 0;

    return Response.json(
      {
        success: true,
        data: records,
        stats: {
          totalCalories,
          dailyAverage: Math.round(dailyAverage),
          period: {
            start: startDate || records[records.length - 1]?.date,
            end: endDate || records[0]?.date
          }
        },
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
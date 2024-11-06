// src/app/api/record/weight/[id]/get/route.js
import { authenticatedUser } from "@/lib/user";
import Weight from "@/db/models/Weight";
import connectDB from "@/db/db";
import { convertWeight } from "@/utils/weightConversion";

export async function GET(req, { params }) {
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
    const preferredUnit = searchParams.get('unit');

    const record = await Weight.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!record) {
      return Response.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    // Convert unit if needed
    if (preferredUnit && record.unit !== preferredUnit) {
      const recordData = record.toObject();
      recordData.weight = preferredUnit === 'kg'
        ? convertWeight.lbsToKg(record.weight)
        : convertWeight.kgToLbs(record.weight);
      recordData.unit = preferredUnit;
      
      return Response.json({
        success: true,
        data: recordData,
      });
    }

    return Response.json(
      {
        success: true,
        data: record,
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
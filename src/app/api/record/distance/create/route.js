// src/app/api/record/distance/create/route.js
import { authenticatedUser } from "@/lib/user";
import Distance from "@/db/models/Distance";
import connectDB from "@/db/db";
import * as Yup from "yup";

const distanceSchema = Yup.object().shape({
  distance: Yup.number()
    .required("Distance is required")
    .positive("Distance must be positive")
    .max(1000, "Distance seems too high"),
  unit: Yup.string()
    .oneOf(['km', 'mi'], "Invalid unit")
    .required("Unit is required"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  note: Yup.string()
    .nullable()
});

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized User" }),
        { status: 401 }
      );
    }

    const data = await req.json();
    
    try {
      await distanceSchema.validate(data);
    } catch (validationError) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationError.errors,
        },
        { status: 400 }
      );
    }

    const distanceRecord = new Distance({
      userId: user.id,
      ...data
    });

    await distanceRecord.save();

    return Response.json(
      {
        success: true,
        message: "Distance record added successfully",
        data: distanceRecord,
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
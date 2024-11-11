// src/app/api/record/water-intake/create/route.js
import { authenticatedUser } from "@/lib/user";
import WaterIntake from "@/db/models/WaterIntake";
import connectDB from "@/db/db";
import * as Yup from "yup";

const waterIntakeSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Water intake amount is required")
    .positive("Amount must be positive")
    .max(5000, "Amount seems too high"),
  unit: Yup.string()
    .oneOf(['ml', 'oz'], "Invalid unit")
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
      await waterIntakeSchema.validate(data);
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

    const waterIntakeRecord = new WaterIntake({
      userId: user.id,
      ...data
    });

    await waterIntakeRecord.save();

    return Response.json(
      {
        success: true,
        message: "Water intake record added successfully",
        data: waterIntakeRecord,
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
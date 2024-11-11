// src/app/api/record/calories-intake/create/route.js
import { authenticatedUser } from "@/lib/user";
import CaloriesIntake from "@/db/models/CaloriesIntake";
import connectDB from "@/db/db";
import * as Yup from "yup";

const caloriesIntakeSchema = Yup.object().shape({
  calories: Yup.number()
    .required("Calories intake is required")
    .positive("Calories must be positive")
    .max(10000, "Calories seem too high"),
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
      await caloriesIntakeSchema.validate(data);
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

    const caloriesRecord = new CaloriesIntake({
      userId: user.id,
      ...data
    });

    await caloriesRecord.save();

    return Response.json(
      {
        success: true,
        message: "Calories intake record added successfully",
        data: caloriesRecord,
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
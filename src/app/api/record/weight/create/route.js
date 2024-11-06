// src/app/api/record/weight/create/route.js
import { authenticatedUser } from "@/lib/user";
import Weight from "@/db/models/Weight";
import connectDB from "@/db/db";
import * as Yup from "yup";

const weightSchema = Yup.object().shape({
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be positive")
    .test('reasonable-weight', 'Weight seems unrealistic', function(value) {
      const unit = this.parent.unit;
      return unit === 'kg' ? value <= 250 : value <= 550;
    }),
  unit: Yup.string()
    .oneOf(['kg', 'lbs'], "Invalid unit")
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
      await weightSchema.validate(data);
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

    const weightRecord = new Weight({
      userId: user.id,
      ...data
    });

    await weightRecord.save();

    return Response.json(
      {
        success: true,
        message: "Weight record added successfully",
        data: weightRecord,
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
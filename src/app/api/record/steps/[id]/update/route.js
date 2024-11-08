// src/app/api/record/steps/[id]/update/route.js
import { authenticatedUser } from "@/lib/user";
import Steps from "@/db/models/Steps";
import connectDB from "@/db/db";
import * as Yup from "yup";

const stepsSchema = Yup.object().shape({
  steps: Yup.number()
    .required("Steps count is required")
    .positive("Steps must be positive")
    .integer("Steps must be a whole number")
    .max(100000, "Steps seem too high"),
  date: Yup.date()
    .required("Date is required")
    .max(new Date(), "Date cannot be in the future"),
  note: Yup.string()
    .nullable()
});

export async function PUT(req, { params }) {
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
      await stepsSchema.validate(data);
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

    const record = await Steps.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      data,
      { new: true }
    );

    if (!record) {
      return Response.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Steps record updated successfully",
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
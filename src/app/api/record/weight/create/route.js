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
    .max(new Date(new Date().setHours(23, 59, 59)), "Date cannot be in the future"),
  note: Yup.string()
    .nullable()
});

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user) {
      return Response.json(
        { success: false, message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const data = await req.json();
    console.log('Received data:', data);  // Debug log
    
    const weightData = {
      ...data,
      unit: data.unit || 'lbs',
      date: (() => {
        const date = new Date(data.date);
        date.setHours(12, 0, 0, 0);
        return date;
      })(),
      note: data.note || ''
    };

    try {
      await weightSchema.validate(weightData);
    } catch (validationError) {
      console.log('Validation error:', validationError.errors);  // Debug log
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationError.errors,
        },
        { status: 400 }
      );
    }

    const startOfDay = new Date(weightData.date);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(weightData.date);
endOfDay.setHours(23, 59, 59, 999);

    const existingWeight = await Weight.findOne({
      userId: user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingWeight) {
      existingWeight.weight = weightData.weight;
      existingWeight.unit = weightData.unit;
      existingWeight.note = weightData.note;
      await existingWeight.save();

      return Response.json({
        success: true,
        message: "Weight record updated successfully",
        data: existingWeight,
      });
    }

    const weightRecord = new Weight({
      userId: user.id,
      ...weightData
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
    console.error("Weight creation error:", error);
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
import connectDB from "@/db/db";
import Support from "@/db/models/Support";
import * as yup from "yup";

const supportSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
});

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    const { isValid, validatedData, errors } = await validateSupportData(data);

    if (!isValid) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    // Create ticket
    const newTicket = new Support({
      ...validatedData,
    });

    await newTicket.save();

    return Response.json(
      {
        success: true,
        message: "Ticket created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create ticket",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function validateSupportData(data) {
  try {
    const validatedData = await supportSchema.validate(data, {
      abortEarly: false,
    });
    return { isValid: true, validatedData: data, errors: null };
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors,
      validatedData: null,
    };
  }
}

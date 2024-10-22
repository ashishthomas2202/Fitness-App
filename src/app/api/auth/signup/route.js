import connectDB from "@/db/db";
import FieldError from "@/lib/errors/FieldError";
import * as yup from "yup";
import { createUser } from "@/lib/user";

const userValidationSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export async function POST(req) {
  try {
    const jsonData = await req.json();

    // Validate the user data
    const { isValid, validatedData, errors } = await validateUserData(jsonData);

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

    await connectDB();

    const user = await createUser(validatedData);
    // console.log("user", user);
    return Response.json(
      {
        success: true,
        message: "User created",
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof FieldError) {
      return Response.json(
        {
          success: false,
          error: {
            field: error.field,
            message: error.message,
          },
        },
        { status: 400 }
      );
    } else {
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
}

async function validateUserData(data) {
  try {
    const validatedData = await userValidationSchema.validate(data, {
      abortEarly: false,
    });
    return { isValid: true, validatedData };
  } catch (errors) {
    return { isValid: false, errors };
  }
}

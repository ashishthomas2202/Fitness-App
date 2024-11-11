// src/app/api/auth/change-password/route.js
import { authenticatedUser } from "@/lib/user";
import * as yup from "yup";
import { compare, hash } from "bcryptjs";
import User from "@/db/models/User";
import connectDB from "@/db/db";

const passwordChangeSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
}).required();

export async function POST(req) {
    try {
      await connectDB();
      const currentUser = await authenticatedUser();
      
      if (!currentUser) {
        return Response.json(
          {
            success: false,
            message: "User not authenticated",
          },
          {
            status: 401,
          }
        );
      }
  
      const data = await req.json();
      console.log('Received data:', { 
        hasCurrentPassword: !!data.currentPassword,
        hasNewPassword: !!data.newPassword,
      });
  
      try {
        await passwordChangeSchema.validate(data, { abortEarly: false });
      } catch (validationError) {
        console.log('Validation errors:', validationError.errors);
        return Response.json(
          {
            success: false,
            message: "Validation failed",
            errors: validationError.errors,
          },
          { status: 400 }
        );
      }
  
      // Get the full user record with hashedPassword
      const userWithPassword = await User.findById(currentUser.id);
      
      if (!userWithPassword) {
        return Response.json(
          {
            success: false,
            message: "User not found",
          },
          {
            status: 404,
          }
        );
      }
  
      const { currentPassword, newPassword } = data;
  
      // Check if user has a password
      if (!userWithPassword.hashedPassword) {
        return Response.json(
          {
            success: false,
            message: "No password is set for this account. You may be using social login.",
          },
          { status: 400 }
        );
      }
  
      // Verify current password
      const isValidPassword = await compare(currentPassword, userWithPassword.hashedPassword);
      
      if (!isValidPassword) {
        return Response.json(
          {
            success: false,
            message: "Current password is incorrect",
          },
          { status: 400 }
        );
      }
  
      // Hash new password
      const newHashedPassword = await hash(newPassword, 12);
  
      // Update password
      userWithPassword.hashedPassword = newHashedPassword;
      await userWithPassword.save();
  
      return Response.json(
        {
          success: true,
          message: "Password updated successfully",
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Server error in password change:", error);
      return Response.json(
        {
          success: false,
          message: error.message || "Failed to change password",
          error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        },
        { status: 500 }
      );
    }
  }
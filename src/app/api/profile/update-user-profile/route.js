import connectDB from "@/db/db";
import Profile from "@/db/models/Profile";
import * as yup from "yup";
import { authenticatedUser } from "@/lib/user";


const profileSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Please select a gender"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future"),
  height: yup
    .number()
    .transform((value, originalValue) => {
      // If the original value is an empty string, cast it to 0 (or null if that's preferred)
      return originalValue === "" ? null : value;
    })
    .required("Height is required")
    .min(1, "Height must be greater than 0"),
  weight: yup
    .number()
    .transform((value, originalValue) => {
      // If the original value is an empty string, cast it to 0 (or null if that's preferred)
      return originalValue === "" ? null : value;
    })
    .required("Weight is required")
    .min(1, "Weight must be greater than 0"),
  phoneNumber: yup
    .string()
    .nullable() // Allows the field to be empty
    .notRequired() // Makes the field optional
    .test(
      "is-valid-phone",
      "Phone number must be exactly 10 digits", // Error message
      (value) => {
        // Skip validation if the field is empty
        if (!value || value.length === 0) return true;
        // Otherwise, check if it's exactly 10 digits
        return /^\d{10}$/.test(value);
      }
    ),
});

export async function POST(req) {
  try {
    const jsonData = await req.json();

    // const { validatedData, errors } = await validateProfileData(jsonData);
    const { isValid, validatedData, errors } = await validateProfileData(
      jsonData
    );

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

    const { firstName, lastName, ...profileData } = validatedData;
    console.log("jsonData:::", jsonData);
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

    const profile = await Profile.findOne({ userId: currentUser.id });
    if (!profile) {
      return Response.json(
        {
          success: false,
          message: "Profile not found",
        },
        {
          status: 404,
        }
      );
    }

    profile.gender = profileData?.gender;
    profile.dob = profileData?.dob;
    profile.height = profileData?.height;
    profile.weight = profileData?.weight;
    profile.phoneNumber = profileData?.phoneNumber;

    await profile.save();

    return Response.json(
      {
        success: true,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}

async function validateProfileData(data) {
  try {
    await profileSchema.validate(data, { abortEarly: false });
    return { isValid: true, validatedData: data };
  } catch (errors) {
    return { isValid: false, errors };
  }
}

// // import { db } from "@/lib/firebaseConfig";
// import db from "@/lib/firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { NextResponse } from "next/server";

// const
// export async function POST(request) {
//   const { user, profileData } = await request.json();

//   if (!user || !user.uid || !profileData) {
//     return NextResponse.json(
//       { error: "User UID and profile data are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Query Firestore for the document with the matching uid
//     const profileRef = collection(db, "profile");
//     const profileQuery = query(profileRef, where("uid", "==", user.uid));
//     const querySnapshot = await getDocs(profileQuery);

//     if (!querySnapshot.empty) {
//       const profileDoc = querySnapshot.docs[0].ref;
//       await updateDoc(profileDoc, profileData);
//       return NextResponse.json(
//         { message: "Profile updated successfully" },
//         { status: 200 }
//       );
//     } else {
//       return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//     }
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }

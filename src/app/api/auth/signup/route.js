import connectDB from "@/db/db";
import FieldError from "@/lib/errors/FieldError";
import User from "@/db/models/User";
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

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";
// import { auth } from "@/lib/firebaseConfig";
// import db from "@/lib/firebase";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     // Handle user creation with Firebase Authentication
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     )
//       .then(async (response) => {
//         const user = response.user;

//         // console.log("usr password::::", user?.reloadUserInfo?.passwordHash);

//         // console.log("User created:", user);
//         // Create a user profile in Firestore with default empty fields
//         const userProfile = {
//           uid: user.uid, // Store uid as a field within the document
//           firstName: "",
//           lastName: "",
//           phoneNumber: "",
//           DOB: null, // Set as null to allow updates
//           gender: "",
//           height: null,
//           weight: null,
//           profilePicture: "",
//         };

//         // Store the profile in Firestore
//         // await setDoc(doc(db, "users", user.uid), userProfile);

//         await addDoc(collection(db, "profile"), userProfile).catch((error) => {
//           console.error("Error adding document: ", error);
//         });

//         const hashedPassword = {
//           uid: user.uid,
//           password: user?.reloadUserInfo?.passwordHash,
//         };
//         await addDoc(collection(db, "hashedPasswords"), hashedPassword).catch(
//           (error) => {
//             console.error("Error adding document: ", error);
//           }
//         );

//         // Return the basic user details from Firebase Authentication
//         return new Response(
//           JSON.stringify({
//             success: true,
//             uid: user.uid,
//             email: user.email,
//           }),
//           {
//             status: 200,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       })
//       .catch((error) => {
//         if (error.code === "auth/email-already-in-use") {
//           return new Response(
//             JSON.stringify({
//               success: false,
//               message: "User with this email already exists.",
//             }),
//             {
//               status: 400,
//               headers: { "Content-Type": "application/json" },
//             }
//           );
//         }

//         return new Response(
//           JSON.stringify({
//             success: false,
//             message: error.message,
//           }),
//           {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//       });

//     return userCredential;
//   } catch (e) {
//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: "An unexpected error occurred.",
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

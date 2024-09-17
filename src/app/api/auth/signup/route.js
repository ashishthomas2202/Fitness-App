import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/firebaseConfig";
import db from "@/lib/firebase";

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     // Handle user creation with Firebase Authentication
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Create a blank profile for the new user in Firestore
//     const profileRef = collection(db, "profile"); // Reference to 'profile' collection
//     await addDoc(profileRef, {
//       uid: user.uid, // Store uid as a field within the document
//       firstName: "",
//       lastName: "",
//       phoneNumber: "",
//       DOB: null, // Set as null to allow updates
//       gender: "",
//       height: null,
//       weight: null,
//       profilePicture: "",
//     });

//     // Return the basic user details from Firebase Authentication
//     return new Response(
//       JSON.stringify({
//         success: true,
//         uid: user.uid,
//         email: user.email,
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     if (error.code === "auth/email-already-in-use") {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "User with this email already exists.",
//         }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: error.message,
//       }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Handle user creation with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then(async (response) => {
        const user = response.user;

        // Create a user profile in Firestore with default empty fields
        const userProfile = {
          uid: user.uid, // Store uid as a field within the document
          firstName: "",
          lastName: "",
          phoneNumber: "",
          DOB: null, // Set as null to allow updates
          gender: "",
          height: null,
          weight: null,
          profilePicture: "",
        };

        // Store the profile in Firestore
        // await setDoc(doc(db, "users", user.uid), userProfile);

        await addDoc(collection(db, "profile"), userProfile).catch((error) => {
          console.error("Error adding document: ", error);
        });

        // Return the basic user details from Firebase Authentication
        return new Response(
          JSON.stringify({
            success: true,
            uid: user.uid,
            email: user.email,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          return new Response(
            JSON.stringify({
              success: false,
              message: "User with this email already exists.",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: false,
            message: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      });

    return userCredential;
  } catch (e) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

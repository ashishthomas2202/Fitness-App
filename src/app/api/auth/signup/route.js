import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Handle user creation with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((response) => {
        const user = response.user;

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

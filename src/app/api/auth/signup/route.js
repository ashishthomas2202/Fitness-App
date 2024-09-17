import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/lib/firebaseConfig";
import db from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Handle user creation with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then(async (response) => {
      const user = response.user;

      // Create a user profile in Firestore with default empty fields
      const userProfile = {
        uid: user.uid,
        displayName: "",
        age: null,
        gender: "",
      };

      // Store the profile in Firestore
      // await setDoc(doc(db, "users", user.uid), userProfile);

      await addDoc(collection(db, "users"), userProfile).catch((error) => {
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
    });
  } catch (error) {
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
  }
}

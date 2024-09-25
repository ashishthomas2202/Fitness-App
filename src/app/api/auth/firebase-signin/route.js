// /pages/api/auth/firebase-signin.js

import { getAuth } from "firebase-admin/auth"; // Make sure Firebase Admin is set up
import { signIn } from "next-auth/react";
import {  } from "@/lib/firebaseAdmin";
// // Firebase Admin SDK initialization
// import { initializeApp, getApps, cert } from "firebase-admin/app";

// if (!getApps().length) {
//   initializeApp({
//     credential: cert({
//       // Your Firebase Admin SDK credentials
//     }),
//   });
// }

export async function POST(req) {
  try {
    const { idToken, email, name, picture } = await req.json();
    console.log("idToken", idToken);
    console.log("email", email);
    console.log("name", name);
    console.log("picture", picture);

    // Verify the Firebase ID Token using Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(idToken);

    console.log("decodedToken", decodedToken);

    if (!decodedToken) {
      return Response.json(
        {
          success: false,
          message: "Invalid Firebase token",
        },
        { status: 401 }
      );
    }

    // Now authenticate the user in NextAuth with this Firebase token
    const session = await signIn("credentials", {
      redirect: false,
      email, // Pass the email as a credential
      token: idToken, // You can use the Firebase ID token as a credential
      name,
      image: picture,
    });

    if (session) {
      return Response.json(
        {
          success: true,
          message: "Signed in successfully",
          session,
        },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        { success: false, message: "NextAuth session failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

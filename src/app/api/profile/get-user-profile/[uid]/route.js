// import { db } from "@/lib/firebaseConfig";
import db from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const userId = params?.userId;
  try {
    // const { user } = await request.json();
    // if (!user || !user.uid) {
    //  return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    // }

    if (!uid) {
      return Response.json(
        {
          success: false,
          message: "User UID is required",
        },
        {
          status: 400,
        }
      );
    }

    // const profile =

    // // Query Firestore using only the uid
    // const profileRef = collection(db, "profile");
    // const profileQuery = query(profileRef, where("uid", "==", uid));
    // const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = querySnapshot.docs[0].data();
    console.log("Profile found:", profile);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

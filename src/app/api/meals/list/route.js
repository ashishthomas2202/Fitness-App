import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }

  try {
    const mealsRef = collection(db, "meals");
    const q = query(mealsRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const meals = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (meals.length === 0) {
      return NextResponse.json({ success: true, data: [], message: "No meals found yet." }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: meals }, { status: 200 });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch meals", error: error.message }, { status: 500 });
  }
}

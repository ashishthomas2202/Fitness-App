import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// Fetch user profile based on email
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Retrieve the profile document by email (which is the document ID)
    const profileRef = doc(db, 'profile', email);
    const profileSnap = await getDoc(profileRef);

    // Return profile data if document exists
    if (profileSnap.exists()) {
      return NextResponse.json({ profile: profileSnap.data() }, { status: 200 });
    } else {
      // Return 404 if profile is not found
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    // Log and return a 500 error if something goes wrong
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

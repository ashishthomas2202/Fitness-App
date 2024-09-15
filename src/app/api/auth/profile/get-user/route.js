import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// Fetch user profile based on email
export async function GET(request) {
// Extract email query parameter from the request URL
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

// Return an error response if email is not provided
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Fetch user document to ensure the email exists
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch profile document based on email
    const profileRef = doc(db, 'profile', email);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return NextResponse.json({ profile: profileSnap.data() }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

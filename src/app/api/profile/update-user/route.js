import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// Update user profile based on email and provided data
export async function POST(request) {
  try {
    const { email, profileData } = await request.json();

    if (!email || !profileData) {
      return NextResponse.json({ error: 'Email and profile data are required' }, { status: 400 });
    }

    const profileRef = doc(db, 'profile', email);
    await setDoc(profileRef, profileData, { merge: true });
    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

// Fetch user profile based on uid
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    console.log('Fetching profile for uid:', uid);  // Debug log

    if (!uid) {
      return NextResponse.json({ error: 'User ID (uid) is required' }, { status: 400 });
    }

    // Fetch document from Firestore
    const profileRef = doc(db, 'profile', uid);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      console.log('Profile data found:', profileSnap.data());  // Log data for debugging
      const profileData = profileSnap.data();

      // Convert Firestore Timestamp to date string if necessary
      if (profileData.DOB && profileData.DOB.seconds) {
        const date = profileData.DOB.toDate();
        profileData.DOB = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      } else {
        profileData.DOB = '';  // Handle missing DOB
      }

      return NextResponse.json({ profile: profileData }, { status: 200 });
    } else {
      console.error('Profile not found for uid:', uid);  // Log if profile not found
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);  // Log detailed error
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { user, profileData } = await request.json();

  if (!user || !user.uid || !profileData) {
    return NextResponse.json({ error: 'User UID and profile data are required' }, { status: 400 });
  }

  try {
    // Query Firestore for the document with the matching uid
    const profileRef = collection(db, 'profile');
    const profileQuery = query(profileRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(profileQuery);

    if (!querySnapshot.empty) {
      const profileDoc = querySnapshot.docs[0].ref;
      await updateDoc(profileDoc, profileData);
      return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

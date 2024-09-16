import { db, storage } from "@/lib/firebaseConfig";
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { NextResponse } from 'next/server';
import { Timestamp } from 'firebase/firestore';

// Update user profile based on email and provided data
export async function POST(request) {
  try {
    const { email, profileData } = await request.json();

    if (!email || !profileData) {
      return NextResponse.json({ error: 'Email and profile data are required' }, { status: 400 });
    }

    // Initialize an object to hold profile data for Firestore
    const updatedProfile = { ...profileData };

    // Convert DOB to Firestore Timestamp if available
    if (profileData.DOB) {
      updatedProfile.DOB = Timestamp.fromDate(new Date(profileData.DOB));
    }

    // Handle profile picture upload if a picture file is provided
    if (profileData.picture) {
      const pictureFile = profileData.picture;  // File object

      // Create a reference to Firebase Storage for the profile picture
      const storageRef = ref(storage, `profilePictures/${email}/${pictureFile.name}`);

      // Upload the file to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, pictureFile);

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Update the profile picture URL in Firestore
      updatedProfile.profilePicture = downloadURL;
    }

    // Save profile data to Firestore
    const profileRef = doc(db, 'profile', email);
    await setDoc(profileRef, updatedProfile, { merge: true });

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
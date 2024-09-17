import { db, storage } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

// Update user profile based on uid and provided data
export async function POST(request) {
  try {
    const formData = await request.formData();
    const uid = formData.get('uid');  // Get uid from FormData instead of email

    if (!uid) {
      return NextResponse.json({ error: 'User ID (uid) is required' }, { status: 400 });
    }

    const updatedProfile = {};

    // Convert DOB (MM/DD/YYYY) to Firestore Timestamp
    const DOBString = formData.get('DOB');
    if (DOBString) {
      const [month, day, year] = DOBString.split('/');
      const DOBDate = new Date(`${year}-${month}-${day}`);
      updatedProfile.DOB = Timestamp.fromDate(DOBDate);
    }

    // Append other profile fields
    updatedProfile.firstName = formData.get('firstName');
    updatedProfile.lastName = formData.get('lastName');
    updatedProfile.phoneNumber = formData.get('phoneNumber');
    updatedProfile.gender = formData.get('gender');
    updatedProfile.height = formData.get('height');
    updatedProfile.weight = formData.get('weight');

    // Handle profile picture upload if provided
    const pictureFile = formData.get('picture');
    if (pictureFile) {
      const storageRef = ref(storage, `profilePictures/${uid}/${pictureFile.name}`);
      const uploadResult = await uploadBytes(storageRef, pictureFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      updatedProfile.profilePicture = downloadURL;
    }

    // Save profile data using the uid as the document ID
    const profileRef = doc(db, 'profile', uid);  // Use uid as document ID
    await setDoc(profileRef, updatedProfile, { merge: true });

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
  }
}

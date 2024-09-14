import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { firstName, lastName, height, weight, gender, profilePicture } = req.body;
    const userEmail = session.user.email; // must match loggin in user

    try {
      const userDocRef = doc(db, 'users', userEmail);
      await setDoc(userDocRef, {
        firstName,
        lastName,
        email,
        phone,
        height,
        weight,
        gender,
        profilePicture
      }, { merge: true });

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
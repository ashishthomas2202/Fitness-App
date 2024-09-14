import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export async function GET(req) {

    const { email } = req.query;
    console.log("email", email)
    try {
        const userDocRef = doc(db, 'profile', email);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            return Response(JSON.stringify({ success: true, data: userSnapshot.data() }))

        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
}
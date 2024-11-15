import connectDB from "@/db/db";
import User from "@/models/User";
import { authenticatedTrainer} from "@/lib/user";

// export default async function handler(req, res) {
//     await connectDB(); 

//   if (req.method === "PATCH") {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { userRole: "trainer" },
//         { new: true }
//       );

//       if (!updatedUser) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       return res.status(200).json({ message: "Role updated to trainer", user: updatedUser });
//     } catch (error) {
//       console.error("Error updating role:", error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
// }


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { userRole: 'trainer' },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

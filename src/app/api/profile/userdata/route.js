// pages/api/userdata.js
import { getSession } from "next-auth/react";
import connectDB from "@/db/db";
import User from "@/db/models/User"; // Ensure the path is correct

export default async function handler(req, res) {
    // Ensure the database connection
    await connectDB();

    // Get session information (user authentication)
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract user ID from session
    const userId = session.user.id; // Ensure session.user has the `id` field
    if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    // Fetch user details from the database using the user ID
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    return res.status(200).json({ success: true, data: user });
}


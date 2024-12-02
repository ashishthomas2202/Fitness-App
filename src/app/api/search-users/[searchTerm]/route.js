import connectDB from "@/db/db";
import User from "@/db/models/User";

export async function GET(req, { params }) {
  const searchTerm = params.searchTerm;

  // Return an empty array if the search term is blank
  if (!searchTerm || searchTerm.trim() === "") {
    return Response.json(
      {
        success: true,
        data: [],
      },
      { status: 200 }
    );
  }

  try {
    await connectDB();

    // Split the search term into words (e.g., "firstName lastName")
    const terms = searchTerm.trim().split(" ");

    // Build dynamic search query
    const query = {
      $or: [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    };

    // Add support for "firstName lastName" search
    if (terms.length > 1) {
      query.$or.push({
        $and: [
          { firstName: { $regex: terms[0], $options: "i" } },
          { lastName: { $regex: terms[1], $options: "i" } },
        ],
      });
    }

    const users = await User.find(query)
      .select("firstName lastName email profile")
      .populate({
        path: "profile",
        select: "profilePicture firstName lastName email",
      })
      .limit(10);

    return Response.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

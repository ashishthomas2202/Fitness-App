// src/app/api/user/preferences/route.js
export async function PUT(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const data = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { preferences: data },
      { new: true }
    );

    return Response.json({ success: true, data: updatedUser });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

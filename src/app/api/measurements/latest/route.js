// src/app/api/measurements/latest/route.js
export async function GET(req) {
  try {
    await connectDB();
    const user = await authenticatedUser();
    if (!user)
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const latestMeasurement = await Measurement.findOne({
      userId: user.id,
    }).sort({ date: -1 });

    return Response.json({ success: true, data: latestMeasurement });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

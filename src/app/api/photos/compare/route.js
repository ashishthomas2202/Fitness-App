// src/app/api/photos/compare/route.js
export async function GET(req) {
    try {
      await connectDB();
      const user = await authenticatedUser();
      if (!user) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const type = searchParams.get('type');
  
      const query = { userId: user.id };
      if (type) query.type = type;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
  
      const photos = await Photo.find(query).sort({ date: 1 });
  
      return Response.json({ success: true, data: photos });
    } catch (error) {
      return Response.json({ success: false, message: error.message }, { status: 500 });
    }
  }
import ImageKit from "imagekit";

export async function DELETE(req, { params }) {
  const { fileName } = params;

  if (!fileName) {
    return Response.json(
      {
        success: false,
        message: "fileName is required",
      },
      { status: 400 }
    );
  }

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  });

  try {
    const files = await new Promise((resolve, reject) => {
      imagekit.listFiles({ type: "all" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (!files || files.length === 0) {
      return Response.json(
        {
          success: false,
          message: "File not found",
        },
        { status: 404 }
      );
    }

    const fileId = files.find((file) => file.name === fileName).fileId;

    const response = await imagekit.deleteFile(fileId);
    return Response.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

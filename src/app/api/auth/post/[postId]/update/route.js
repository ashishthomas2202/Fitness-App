import connectDB from "@/db/db";
import Post from "@/db/models/Post";
import * as yup from "yup";

// Define a Yup schema for validation
const postSchema = yup.object().shape({
  author: yup.string().required("Author is required."),
  contentType: yup
    .string()
    .oneOf(["achievement", "post", "share"], "Invalid content type.")
    .required("Content type is required."),
  contentData: yup.mixed().required("Content data is required."),
  visibility: yup
    .string()
    .oneOf(
      ["public", "private"],
      "Visibility must be either public or private."
    )
    .default("private"),
});

export async function PUT(req, { params }) {
  const postId = params?.postId;
  try {
    await connectDB(); // Connect to the database

    const data = await req.json();

    // Validate incoming data with Yup
    // await postSchema.validate(data, { abortEarly: false });

    const { isValid, validatedData, errors } = await validatePostData(data);

    if (!isValid) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    const { author, contentType, contentData, visibility } = validatedData;

    // Update the post in the database
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { author, contentType, contentData, visibility },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return Response.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to update post", error },
      { status: 500 }
    );
  }
}

async function validatePostData(data) {
  try {
    const validatedData = await postSchema.validate(data, {
      abortEarly: false,
    });
    return { isValid: true, validatedData, errors: null };
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors,
      validatedData: null,
    };
  }
}

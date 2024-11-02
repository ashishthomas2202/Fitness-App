// /app/api/posts/create/route.js

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

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    const { isValid, validatedData, errors } = await validatePostData(data);

    if (!isValid) {
      return Response.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const {
      author,
      contentType,
      contentData,
      visibility = "private",
    } = validatedData;

    // Create the post document
    const newPost = new Post({
      author,
      contentType,
      contentData,
      visibility,
    });

    // Save the post to the database
    const savedPost = await newPost.save();

    // Return a response with the created post data
    return Response.json(
      {
        success: true,
        message: "Post created successfully",
        data: savedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Failed to create post", error },
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

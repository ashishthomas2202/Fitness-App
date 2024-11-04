import connectDB from "@/db/db";
import Post from "@/db/models/Post";
import * as yup from "yup";

// Define a Yup schema for top-level fields, including the media field
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
  media: yup
    .array()
    .of(
      yup.object().shape({
        url: yup
          .string()
          .url("Media URL must be a valid URL")
          .required("URL is required for media"),
        type: yup
          .string()
          .oneOf(["image", "video"], "Media type must be 'image' or 'video'")
          .required("Media type is required"),
        metadata: yup
          .object()
          .shape({
            size: yup.number().positive("Size must be positive"),
            resolution: yup.object().shape({
              width: yup.number().positive("Width must be positive"),
              height: yup.number().positive("Height must be positive"),
            }),
          })
          .optional(),
      })
    )
    .optional(),
});

// Recursive comment validation function
function validateComments(comments) {
  if (!Array.isArray(comments)) {
    throw new yup.ValidationError("Comments must be an array");
  }

  comments.forEach((comment) => {
    if (typeof comment.commenter !== "string" || !comment.commenter) {
      throw new yup.ValidationError(
        "Each comment must have a valid commenter ID"
      );
    }

    if (typeof comment.comment !== "string" || !comment.comment) {
      throw new yup.ValidationError("Each comment must have text");
    }

    if (comment.replies && Array.isArray(comment.replies)) {
      // Recursively validate replies
      validateComments(comment.replies);
    } else if (comment.replies) {
      throw new yup.ValidationError("Replies must be an array if present");
    }
  });
}

// Main validation function with custom comment validation
async function validatePostData(data) {
  try {
    const validatedData = await postSchema.validate(data, {
      abortEarly: false,
    });

    if (data.comments) {
      validateComments(data.comments); // Apply custom recursive validation
    }

    return { isValid: true, validatedData: data, errors: null };
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors,
      validatedData: null,
    };
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate data using Yup and custom recursive validation
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
      comments = [],
      media = [],
    } = validatedData;

    // Create the post document
    const newPost = new Post({
      author,
      contentType,
      contentData,
      visibility,
      comments,
      media,
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
      {
        success: false,
        message: "Failed to create post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

import User from "@/db/models/User";
import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the comment schema with recursive referencing for nested comments
const commentSchema = new Schema(
  {
    commenter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Reference to the same schema, allowing multi-level nesting
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create a Comment model for recursive referencing
const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

// Define the post schema
const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    contentData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        metadata: {
          size: Number, // Optional: size of the media file in bytes
          resolution: {
            width: Number,
            height: Number,
          },
        },
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;

export { Post, Comment };

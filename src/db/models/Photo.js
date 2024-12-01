// src/db/models/Photo.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    imageKitFileId: {
      type: String,
      required: [true, "ImageKit File ID is required"],
    },
    type: {
      type: String,
      enum: ["front", "side", "back"],
      required: [true, "Photo type is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    note: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Photo = mongoose.models.Photo || mongoose.model("Photo", PhotoSchema);

export default Photo;

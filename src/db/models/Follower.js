import mongoose from "mongoose";
import User from "@/db/models/User";
import { Schema } from "mongoose";

const followerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
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

const Follower =
  mongoose.models.Follower || mongoose.model("Follower", followerSchema);

export default Follower;

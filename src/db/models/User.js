import Profile from "@/db/models/Profile";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    userRole: {
      type: String,
      default: "user",
      enum: ["user", "admin", "trainer"],
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.hashedPassword;
        delete ret.__v;
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.hashedPassword;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for Profile
UserSchema.virtual("profile", {
  ref: "Profile", // The model to use
  localField: "_id", // Match the `User` `_id`
  foreignField: "userId", // Match this to the `userId` in `Profile`
  justOne: true, // Optional: set to `true` if each user has only one profile
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

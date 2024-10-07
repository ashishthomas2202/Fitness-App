const User = require("@/db/models/User");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      // enum: ["Male", "Female", "Other",""],
      default: null,
    },
    dob: {
      type: Date,
      // required: true,
      default: null,
    },
    height: {
      type: Number,
      // required: true,
      default: null,
    },
    weight: {
      type: Number,
      // required: true,
      default: null,
    },
    phoneNumber: {
      type: String,
      // default: "",
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  preferences: {
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "lbs"
    },
    measurementUnit: {
      type: String,
      enum: ["in", "cm"],
      default: "in"
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.hashedPassword;
      delete ret.__v;
      return ret;
    },
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter =
  mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);

export default Newsletter;

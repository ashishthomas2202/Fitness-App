import mongoose from "mongoose";
const Schema = mongoose.Schema;


const AchievementSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        target: {
            type: Number,
            required: true
        },
        badgeImage: {
            type: String,
            required: true
        }, // URL for the badge image
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

export default mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserAchievementSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        achievementId: {
            type: Schema.Types.ObjectId,
            ref: "Achievement",
            required: true
        },
        progress: {
            type: Number,
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
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

export default mongoose.models.UserAchievement ||
    mongoose.model("UserAchievement", UserAchievementSchema);

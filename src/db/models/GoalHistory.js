import mongoose from "mongoose";

const GoalHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    }, // Goal name
    progress: {
        type: Number,
        required: true
    }, // Achieved progress
    target: {
        type: Number,
        required: true
    }, // Goal target
    isCompleted: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Date, default: Date.now
    },
}, {
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

const GoalHistory = mongoose.models.GoalHistory || mongoose.model("GoalHistory", GoalHistorySchema);

export default GoalHistory;
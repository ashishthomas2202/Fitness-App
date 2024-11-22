import mongoose from "mongoose";
const Schema = mongoose.Schema;


const GoalHistorySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        goals: [
            {
                name: {
                    type: String,
                    required: true,
                },
                target: {
                    type: Number,
                    required: true,
                },
                progress: {
                    type: Number,
                    required: true,
                },
                isCompleted: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        notes: {
            type: String, // Ensure this field is present
            default: "",
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

export default mongoose.models.GoalHistory || mongoose.model("GoalHistory", GoalHistorySchema);

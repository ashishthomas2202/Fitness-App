// Goal.js (your Goal schema file)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    calorieGoal: {
        type: Number,
        required: true
    },
    weightGoal: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    weightHistory: [
        {
            date: { type: Date, default: Date.now },
            weight: { type: Number, required: true },
        },
    ],
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
});

module.exports = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);

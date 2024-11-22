// Goal.js (Schema for Goal in MongoDB)
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
    stepsGoal: {
        type: Number,
        default: 0
    },
    flightsClimbedGoal: {
        type: Number,
        default: 0
    },
    distanceGoal: {
        type: Number,
        default: 0
    },
    waterIntakeGoal: {
        type: Number,
        default: 0
    },
    caloriesBurnedGoal: {
        type: Number,
        default: 0
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

// src/db/models/CaloriesBurned.js
const CaloriesBurnedSchema = new Schema(
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      calories: {
        type: Number,
        required: [true, "Calories burned is required"],
        min: [0, "Calories cannot be negative"],
      },
      source: {
        type: String,
        enum: ['workout', 'activity', 'other'],
        default: 'other'
      },
      date: {
        type: Date,
        required: [true, "Date is required"],
      },
      note: {
        type: String,
        default: "",
      }
    },
    { timestamps: true }
  );
  
  CaloriesBurnedSchema.index({ userId: 1, date: 1 });
  const CaloriesBurned = mongoose.models.CaloriesBurned || mongoose.model("CaloriesBurned", CaloriesBurnedSchema);
  export default CaloriesBurned;
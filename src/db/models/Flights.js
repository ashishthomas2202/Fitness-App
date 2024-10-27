// src/db/models/Flights.js
const FlightsSchema = new Schema(
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      flights: {
        type: Number,
        required: [true, "Flights count is required"],
        min: [0, "Flights cannot be negative"],
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
  
  FlightsSchema.index({ userId: 1, date: 1 });
  const Flights = mongoose.models.Flights || mongoose.model("Flights", FlightsSchema);
  export default Flights;
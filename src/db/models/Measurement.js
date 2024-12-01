// src/db/models/Measurement.js
import mongoose from "mongoose";

const MeasurementSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    measurements: {
      chest: { type: Number, required: false },
      waist: { type: Number, required: false },
      hips: { type: Number, required: false },
      biceps: { type: Number, required: false },
      thighs: { type: Number, required: false },
    },
    unit: {
      type: String,
      required: true,
      enum: ["in", "cm"],
    },
  },
  {
    timestamps: true,
  }
);

MeasurementSchema.pre("save", function (next) {
  if (this.measurements) {
    Object.keys(this.measurements).forEach((key) => {
      if (
        this.measurements[key] === undefined ||
        this.measurements[key] === null
      ) {
        delete this.measurements[key];
      }
    });
  }
  next();
});

export default mongoose.models.Measurement ||
  mongoose.model("Measurement", MeasurementSchema);

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    service: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    symptoms: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    prescription: {
      type: String,
    },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for formatted date
appointmentSchema.virtual("formattedDate").get(function () {
  return this.appointmentDate ? this.appointmentDate.toLocaleDateString() : "";
});

// Virtual field for formatted time
appointmentSchema.virtual("formattedTime").get(function () {
  return this.appointmentDate ? this.appointmentDate.toLocaleTimeString() : "";
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

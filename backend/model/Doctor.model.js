import mongoose from "mongoose";
const doctorSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Doctor",
    },
    qualification: {
      type: String,
      default: "",
    },
    specialist: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zip: { type: String, default: "" },
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

const Doctor = new mongoose.model("Doctor", doctorSchema);
export default Doctor;

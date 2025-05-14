import mongoose from "mongoose";
const patientSchema = mongoose.Schema(
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
    doctor_app: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    role: {
      type: String,
      default: "Patient",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zip: { type: String, default: "" },
    },

    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Patient = new mongoose.model("Patient", patientSchema);
export default Patient;

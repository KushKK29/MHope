import mongoose from "mongoose";
const receptionistSchema = mongoose.Schema(
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
    role: {
      type: String,
      default: "Receptionist",
    },
    qualification: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Receptionist = new mongoose.model("Receptionist", receptionistSchema);
export default Receptionist;

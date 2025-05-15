import mongoose from "mongoose";
import Appointment from "./model/appointment.model.js";

const appointments = [
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-08T10:30:00"),
    date: "2025-05-08",
    time: "10:30 AM",
    status: "confirmed",
    service: "consultation",
    fee: 2000,
    notes: "Regular checkup",
    symptoms: "None",
    diagnosis: "Healthy",
    prescription: "None",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-09T14:15:00"),
    date: "2025-05-09",
    time: "2:15 PM",
    status: "confirmed",
    service: "follow-up",
    fee: 1500,
    notes: "Follow-up visit",
    symptoms: "None",
    diagnosis: "Recovering well",
    prescription: "Continue current medication",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-10T09:00:00"),
    date: "2025-05-10",
    time: "9:00 AM",
    status: "pending",
    service: "consultation",
    fee: 2000,
    notes: "New patient visit",
    symptoms: "Headache",
    diagnosis: "Pending",
    prescription: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Adding appointments for later dates
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-10T14:30:00"),
    date: "2025-05-10",
    time: "2:30 PM",
    status: "confirmed",
    service: "therapy",
    fee: 2500,
    notes: "Physical therapy session",
    symptoms: "Back pain",
    diagnosis: "Muscle strain",
    prescription: "Physical therapy exercises",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-11T10:00:00"),
    date: "2025-05-11",
    time: "10:00 AM",
    status: "confirmed",
    service: "consultation",
    fee: 2000,
    notes: "Follow-up checkup",
    symptoms: "Mild fever",
    diagnosis: "Viral infection",
    prescription: "Rest and medication",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-11T15:45:00"),
    date: "2025-05-11",
    time: "3:45 PM",
    status: "pending",
    service: "follow-up",
    fee: 1800,
    notes: "Review test results",
    symptoms: "None",
    diagnosis: "Pending lab results",
    prescription: "To be determined",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-12T09:30:00"),
    date: "2025-05-12",
    time: "9:30 AM",
    status: "confirmed",
    service: "consultation",
    fee: 2200,
    notes: "Initial consultation",
    symptoms: "Chronic pain",
    diagnosis: "To be determined",
    prescription: "To be determined",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    patientId: new mongoose.Types.ObjectId(),
    doctorId: new mongoose.Types.ObjectId(),
    appointmentDate: new Date("2025-05-12T13:15:00"),
    date: "2025-05-12",
    time: "1:15 PM",
    status: "confirmed",
    service: "therapy",
    fee: 1800,
    notes: "Regular therapy session",
    symptoms: "Anxiety",
    diagnosis: "Anxiety disorder",
    prescription: "Continuation of current treatment",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/mhope", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log("Cleared existing appointments");

    // Insert new appointments
    const result = await Appointment.insertMany(appointments);
    console.log(`Inserted ${result.length} appointments`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Run the seeding
seedDB();

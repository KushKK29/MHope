import mongoose from "mongoose";
import dotenv from "dotenv";
import Appointment from "./model/appointment.model.js";

// Load environment variables
dotenv.config();

export const dummyAppointments = [
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246807"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246cbf"),
    appointmentDate: new Date("2025-05-08T10:30:00"),
    date: "2025-05-08",
    time: "10:30 AM",
    status: "cancelled",
    service: "follow-up",
    fee: 2000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-07T00:00:00"),
    updatedAt: new Date("2025-05-07T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246f7d"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2466a6"),
    appointmentDate: new Date("2025-05-08T10:15:00"),
    date: "2025-05-08",
    time: "10:15 AM",
    status: "completed",
    service: "therapy",
    fee: 2000,
    notes: "Patient reports muscle weakness and shortness of breath.",
    symptoms: "Muscle cramps, weakness",
    diagnosis: "Respiratory infection",
    prescription: "Antibiotics",
    createdAt: new Date("2025-05-07T00:00:00"),
    updatedAt: new Date("2025-05-07T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246bcf"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246bd1"),
    appointmentDate: new Date("2025-05-12T14:15:00"),
    date: "2025-05-12",
    time: "2:15 PM",
    status: "completed",
    service: "therapy",
    fee: 1000,
    notes: "Patient has a follow-up for blood test results.",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Anemia",
    prescription: "Iron supplements",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246303"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc24639b"),
    appointmentDate: new Date("2025-05-12T08:00:00"),
    date: "2025-05-12",
    time: "8:00 AM",
    status: "confirmed",
    service: "follow-up",
    fee: 1500,
    notes: "Patient is experiencing frequent headaches and dizziness.",
    symptoms: "Fatigue, nausea",
    diagnosis: "Muscle strain",
    prescription: "Physical therapy",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246e33"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2463f0"),
    appointmentDate: new Date("2025-05-12T09:00:00"),
    date: "2025-05-12",
    time: "9:00 AM",
    status: "confirmed",
    service: "therapy",
    fee: 1000,
    notes: "Patient has a follow-up for blood test results.",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Anemia",
    prescription: "Iron supplements",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246056"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246f17"),
    appointmentDate: new Date("2025-05-12T08:00:00"),
    date: "2025-05-12",
    time: "8:00 AM",
    status: "cancelled",
    service: "follow-up",
    fee: 1000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246946"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246ea8"),
    appointmentDate: new Date("2025-05-12T14:45:00"),
    date: "2025-05-12",
    time: "2:45 PM",
    status: "confirmed",
    service: "consultation",
    fee: 2000,
    notes: "Patient reports muscle weakness and shortness of breath.",
    symptoms: "Muscle cramps, weakness",
    diagnosis: "Respiratory infection",
    prescription: "Antibiotics",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246657"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246da8"),
    appointmentDate: new Date("2025-05-12T08:45:00"),
    date: "2025-05-12",
    time: "8:45 AM",
    status: "cancelled",
    service: "therapy",
    fee: 2000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc24688c"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246ba2"),
    appointmentDate: new Date("2025-05-12T10:30:00"),
    date: "2025-05-12",
    time: "10:30 AM",
    status: "cancelled",
    service: "consultation",
    fee: 2000,
    notes: "Patient is experiencing frequent headaches and dizziness.",
    symptoms: "Fatigue, nausea",
    diagnosis: "Muscle strain",
    prescription: "Physical therapy",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2463c9"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246eee"),
    appointmentDate: new Date("2025-05-11T08:00:00"),
    date: "2025-05-11",
    time: "8:00 AM",
    status: "completed",
    service: "therapy",
    fee: 1500,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2465c8"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2464b0"),
    appointmentDate: new Date("2025-05-11T08:15:00"),
    date: "2025-05-11",
    time: "8:15 AM",
    status: "confirmed",
    service: "therapy",
    fee: 2000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246be8"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246d79"),
    appointmentDate: new Date("2025-05-11T10:30:00"),
    date: "2025-05-11",
    time: "10:30 AM",
    status: "completed",
    service: "therapy",
    fee: 1000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246a8e"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246774"),
    appointmentDate: new Date("2025-05-11T08:00:00"),
    date: "2025-05-11",
    time: "8:00 AM",
    status: "cancelled",
    service: "consultation",
    fee: 2000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246807"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246cbf"),
    appointmentDate: new Date("2025-05-08T10:30:00"),
    date: "2025-05-08",
    time: "10:30 AM",
    status: "cancelled",
    service: "follow-up",
    fee: 2000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-07T00:00:00"),
    updatedAt: new Date("2025-05-07T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246f7d"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2466a6"),
    appointmentDate: new Date("2025-05-08T10:15:00"),
    date: "2025-05-08",
    time: "10:15 AM",
    status: "completed",
    service: "therapy",
    fee: 2000,
    notes: "Patient reports muscle weakness and shortness of breath.",
    symptoms: "Muscle cramps, weakness",
    diagnosis: "Respiratory infection",
    prescription: "Antibiotics",
    createdAt: new Date("2025-05-07T00:00:00"),
    updatedAt: new Date("2025-05-07T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246bcf"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246bd1"),
    appointmentDate: new Date("2025-05-12T14:15:00"),
    date: "2025-05-12",
    time: "2:15 PM",
    status: "completed",
    service: "therapy",
    fee: 1000,
    notes: "Patient has a follow-up for blood test results.",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Anemia",
    prescription: "Iron supplements",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246303"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc24639b"),
    appointmentDate: new Date("2025-05-12T08:00:00"),
    date: "2025-05-12",
    time: "8:00 AM",
    status: "confirmed",
    service: "follow-up",
    fee: 1500,
    notes: "Patient is experiencing frequent headaches and dizziness.",
    symptoms: "Fatigue, nausea",
    diagnosis: "Muscle strain",
    prescription: "Physical therapy",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246e33"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2463f0"),
    appointmentDate: new Date("2025-05-12T09:00:00"),
    date: "2025-05-12",
    time: "9:00 AM",
    status: "confirmed",
    service: "therapy",
    fee: 1000,
    notes: "Patient has a follow-up for blood test results.",
    symptoms: "Chest pain, shortness of breath",
    diagnosis: "Anemia",
    prescription: "Iron supplements",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246056"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246f17"),
    appointmentDate: new Date("2025-05-12T08:00:00"),
    date: "2025-05-12",
    time: "8:00 AM",
    status: "cancelled",
    service: "follow-up",
    fee: 1000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-08T00:00:00"),
    updatedAt: new Date("2025-05-08T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246946"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246ea8"),
    appointmentDate: new Date("2025-05-12T14:45:00"),
    date: "2025-05-12",
    time: "2:45 PM",
    status: "confirmed",
    service: "consultation",
    fee: 2000,
    notes: "Patient reports muscle weakness and shortness of breath.",
    symptoms: "Muscle cramps, weakness",
    diagnosis: "Respiratory infection",
    prescription: "Antibiotics",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246657"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246da8"),
    appointmentDate: new Date("2025-05-12T08:45:00"),
    date: "2025-05-12",
    time: "8:45 AM",
    status: "cancelled",
    service: "therapy",
    fee: 2000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc24688c"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246ba2"),
    appointmentDate: new Date("2025-05-12T10:30:00"),
    date: "2025-05-12",
    time: "10:30 AM",
    status: "cancelled",
    service: "consultation",
    fee: 2000,
    notes: "Patient is experiencing frequent headaches and dizziness.",
    symptoms: "Fatigue, nausea",
    diagnosis: "Muscle strain",
    prescription: "Physical therapy",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2463c9"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246eee"),
    appointmentDate: new Date("2025-05-11T08:00:00"),
    date: "2025-05-11",
    time: "8:00 AM",
    status: "completed",
    service: "therapy",
    fee: 1500,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2465c8"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc2464b0"),
    appointmentDate: new Date("2025-05-11T08:15:00"),
    date: "2025-05-11",
    time: "8:15 AM",
    status: "confirmed",
    service: "therapy",
    fee: 2000,
    notes: "Patient complains of back pain and fatigue.",
    symptoms: "Back pain, muscle weakness",
    diagnosis: "Hypertension",
    prescription: "Blood pressure medication",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246be8"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246d79"),
    appointmentDate: new Date("2025-05-11T10:30:00"),
    date: "2025-05-11",
    time: "10:30 AM",
    status: "completed",
    service: "therapy",
    fee: 1000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
  {
    patientId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246a8e"),
    doctorId: new mongoose.Types.ObjectId("663bd134f3b35e52dc246774"),
    appointmentDate: new Date("2025-05-11T08:00:00"),
    date: "2025-05-11",
    time: "8:00 AM",
    status: "cancelled",
    service: "consultation",
    fee: 2000,
    notes: "Patient reports mild chest pain.",
    symptoms: "Headache, dizziness, blurred vision",
    diagnosis: "Migraine",
    prescription: "Pain relievers, rest, hydration",
    createdAt: new Date("2025-05-12T00:00:00"),
    updatedAt: new Date("2025-05-12T00:00:00"),
  },
];

// MongoDB connection with better timeout and options
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mhope",
      {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        writeConcern: { wtimeout: 30000 }, // 30 seconds write timeout
      }
    );
    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

// Function to seed appointments with better error handling
const seedAppointments = async () => {
  try {
    // Clear existing appointments
    console.log("Clearing existing appointments...");
    await Appointment.deleteMany({});

    // Count total appointments
    console.log(`Total appointments to insert: ${dummyAppointments.length}`);

    // Insert all appointments at once with a longer timeout
    const result = await Appointment.insertMany(dummyAppointments, {
      timeout: 60000, // 60 seconds timeout
      ordered: false, // Continue inserting even if some documents fail
    });

    console.log(`Successfully inserted ${result.length} appointments`);
    return result;
  } catch (error) {
    console.error("Error seeding appointments:", error);
    throw error;
  }
};

// Main function to run the seeding process
const runSeeding = async () => {
  try {
    // Connect to MongoDB
    const connected = await connectDB();
    if (!connected) {
      console.error("Failed to connect to MongoDB");
      process.exit(1);
    }

    // Seed appointments
    const result = await seedAppointments();
    console.log(`Seeding completed. Inserted ${result.length} appointments`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    // Close MongoDB connection
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
    process.exit(0);
  }
};

// Run the seeding process
runSeeding();

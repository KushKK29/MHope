import mongoose from "mongoose";
import dotenv from "dotenv";
import Appointment from "./model/appointment.model.js";

// Load environment variables
dotenv.config();

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
};

// Improved MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/mhope",
        mongoOptions
      );
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(
        `MongoDB connection error (attempt ${i + 1}):`,
        error.message
      );
      if (i < retries - 1) {
        console.log(`Retrying connection... Attempt ${i + 2} of ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
  }
  return false;
};

// Function to seed appointments
const seedAppointments = async () => {
  try {
    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log("Cleared existing appointments");

    // Get your existing dummyAppointments array
    const { dummyAppointments } = await import("./dummyData.js");

    // Insert new appointments in batches of 10
    const batchSize = 10;
    for (let i = 0; i < dummyAppointments.length; i += batchSize) {
      const batch = dummyAppointments.slice(i, i + batchSize);
      await Appointment.insertMany(batch, { timeout: 30000 }); // 30 seconds timeout
      console.log(
        `Inserted appointments ${i + 1} to ${Math.min(
          i + batchSize,
          dummyAppointments.length
        )}`
      );
    }

    console.log("Successfully seeded appointments");
  } catch (error) {
    console.error("Error seeding appointments:", error.message);
    throw error;
  }
};

// Main function to run the seeding process
const runSeeding = async () => {
  try {
    // Connect to MongoDB
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error("Failed to connect to MongoDB after multiple retries");
      process.exit(1);
    }

    // Seed the appointments
    await seedAppointments();
    console.log("Seeding completed successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    // Close the MongoDB connection
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error.message);
    }
    process.exit(0);
  }
};

// Run the seeding process
runSeeding();

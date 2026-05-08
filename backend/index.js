import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import doctorRouter from "./routes/doctor.route.js";
import patientRouter from "./routes/patient.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import reportsRouter from "./routes/Report.route.js";
import adminRouter from "./routes/admin.route.js";
import prescriptionRouter from "./routes/prescription.routes.js";
import fs from "fs";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://m-hope.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/prescription", prescriptionRouter);

// MongoDB connection
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      if (i < retries - 1) {
        console.log(`Retrying connection... Attempt ${i + 2} of ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
  return false;
};

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🧠 "Kill Me Not" (Keep Alive) Function
const keepAlive = () => {
  const url = process.env.SERVER_URL || `http://localhost:${PORT}/health`; 
  console.log(`[KEEP-ALIVE] Monitoring started for: ${url}`);

  setInterval(async () => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`[KEEP-ALIVE] Ping successful at ${new Date().toISOString()}`);
      } else {
        console.error(`[KEEP-ALIVE] Ping failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error(`[KEEP-ALIVE] Ping failed: ${err.message}`);
    }
  }, 15 * 60 * 1000); // Every 15 minutes
};

// Start server
const startServer = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error("Failed to connect to MongoDB after multiple retries");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      keepAlive(); // <— START KEEP ALIVE LOOP HERE
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

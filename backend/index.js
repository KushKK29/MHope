import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import doctorRouter from "./routes/doctor.route.js";
import patientRouter from "./routes/patient.route.js";
import appointmentRouter from "./routes/appointment.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// connectingg routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);
app.use("/api/appointment", appointmentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

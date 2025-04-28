import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByid,
  updateAppointment,
  deleteAppointment,
} from "../controllers/Appointment.controller.js";
// import { authenticate } from "../middleware/authMiddleware.js";

const appointmentRouter = express.Router();

// Apply authentication middleware to all appointment routes
// appointmentRouter.use(authenticate);

// Appointment routes
appointmentRouter.post("/", createAppointment);
appointmentRouter.get("/getAllAppointments", getAllAppointments);
appointmentRouter.get("/getAppointments/:id", getAppointmentsByid);
appointmentRouter.put("/updateAppointment/:id", updateAppointment);
appointmentRouter.delete("/deleteAppointment/:id", deleteAppointment);

export default appointmentRouter;

import express from "express";
import {
  getAppointmentStats,
  getOverviewStats,
  getDoctorStats,
  getRevenueStats,
} from "../controllers/Report.controller.js";
const reportsRouter = express.Router();

// Get overview statistics
reportsRouter.get("/overview", getOverviewStats);

// Get appointment statistics
reportsRouter.get("/appointments", getAppointmentStats);

// Get doctor statistics
reportsRouter.get("/doctors", getDoctorStats);

// Get revenue statistics
reportsRouter.get("/revenue", getRevenueStats);

export default reportsRouter;

import express from "express";
import {
  getAppointmentStats,
  getOverviewStats,
  getDoctorStats,
  getRevenueStats,
} from "../controllers/Report.controller.js";
const router = express.Router();

// Get overview statistics
router.get("/overview", getOverviewStats);

// Get appointment statistics
router.get("/appointments", getAppointmentStats);

// Get doctor statistics
router.get("/doctors", getDoctorStats);

// Get revenue statistics
router.get("/revenue", getRevenueStats);

export default router;

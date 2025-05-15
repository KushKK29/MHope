import express from "express";
import {
  overViewStats,
  last7daysApointment,
  departmentwiseData,
  newRegistrations,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Get overview statistics
router.get("/overview", overViewStats);
router.get("/last7appointments", last7daysApointment);
router.get("/departmentwise", departmentwiseData);
router.get("/newregistrations", newRegistrations);

export default router;

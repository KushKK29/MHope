import express from "express";
import {
  createPrescription,
  getPrescriptionsByPatientId,
  getPrescriptionsByDoctorId,
  downloadPrescriptionPDF,
} from "../controllers/Prescription.controller.js";

const prescriptionRouter = express.Router();

// Debug middleware
prescriptionRouter.use((req, res, next) => {
  console.log(`Prescription Route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

// Create prescription (protected route)
prescriptionRouter.post("/create", createPrescription);

// Get prescriptions by patient ID (protected route)
prescriptionRouter.get("/patient/:patientId", getPrescriptionsByPatientId);

// Get prescriptions by doctor ID (protected route)
prescriptionRouter.get("/doctor/:doctorId", getPrescriptionsByDoctorId);

// Get prescription as PDF (protected route)
prescriptionRouter.get("/download/:prescriptionId", downloadPrescriptionPDF);

export default prescriptionRouter;

import Prescription from "../model/Prescription.model.js";
import Patient from "../model/Patient.model.js";
import Doctor from "../model/Doctor.model.js";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "kush282930@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "winz fvto fqle nsdz",
  },
});

// Function to generate PDF
const generatePDF = async (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, `../temp/${prescription._id}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);

    // Add hospital logo and header
    doc.fontSize(20).text("MHope Hospital", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text("Medical Prescription", { align: "center" });
    doc.moveDown();

    // Add doctor details
    doc.fontSize(12).text(`Doctor: ${doctor.fullName}`);
    doc.text(`Department: ${doctor.department}`);
    doc.text(`Contact: ${doctor.phone}`);
    doc.moveDown();

    // Add patient details
    doc.text(`Patient Name: ${patient.fullName}`);
    doc.text(`Patient ID: ${patient._id}`);
    doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`);
    doc.moveDown();

    // Add diagnosis
    doc.fontSize(14).text("Diagnosis:");
    doc.fontSize(12).text(prescription.diagnosis);
    doc.moveDown();

    // Add medicines
    doc.fontSize(14).text("Prescribed Medicines:");
    prescription.medicines.forEach((medicine, index) => {
      doc.text(`${index + 1}. ${medicine.name}`);
      doc.text(`   Dosage: ${medicine.dosage}`);
      doc.text(`   Frequency: ${medicine.frequency}`);
      doc.text(`   Duration: ${medicine.duration}`);
      doc.moveDown();
    });

    // Add advice if any
    if (prescription.advice) {
      doc.fontSize(14).text("Additional Advice:");
      doc.fontSize(12).text(prescription.advice);
    }

    // Add footer
    doc.moveDown(2);
    doc.fontSize(10).text("This is a computer-generated prescription", {
      align: "center",
    });
    doc.text("No signature required", { align: "center" });

    doc.end();

    writeStream.on("finish", () => {
      resolve(pdfPath);
    });

    writeStream.on("error", (error) => {
      reject(error);
    });
  });
};

// Create prescription and send email
export const createPrescription = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const {
      patientId,
      doctorId,
      diagnosis,
      medicines,
      advice,
      doctorName,
      doctorEmail,
      doctorPhone,
      doctorDepartment,
    } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !diagnosis || !medicines) {
      console.log("Missing required fields:", {
        patientId,
        doctorId,
        diagnosis,
        medicines,
      });
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: patientId, doctorId, diagnosis, and medicines are required",
      });
    }

    // Create new prescription
    const prescription = new Prescription({
      patientId,
      doctorId,
      diagnosis,
      medicines,
      advice,
    });

    console.log("Created prescription object:", prescription);

    await prescription.save();
    console.log("Prescription saved successfully");

    // Get patient and doctor details with detailed error logging
    console.log("Looking up patient with ID:", patientId);
    const patient = await Patient.findById(patientId);
    console.log("Patient lookup result:", patient ? "Found" : "Not found");

    console.log("Looking up doctor with ID:", doctorId);
    const doctor = await Doctor.findById(doctorId);
    console.log("Doctor lookup result:", doctor ? "Found" : "Not found");

    if (!patient) {
      console.log("Patient not found in database. Patient ID:", patientId);
      return res.status(404).json({
        success: false,
        message: "Patient not found. Please verify the patient ID.",
        patientId: patientId,
      });
    }

    if (!doctor) {
      console.log("Doctor not found in database. Doctor ID:", doctorId);
      return res.status(404).json({
        success: false,
        message: "Doctor not found. Please verify the doctor ID.",
        doctorId: doctorId,
      });
    }

    try {
      // Generate PDF
      console.log("Starting PDF generation...");
      const pdfPath = await generatePDF(prescription, patient, doctor);
      console.log("PDF generated successfully at:", pdfPath);

      // Send email with PDF attachment
      console.log("Preparing to send email...");
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patient.email,
        subject: "Your Medical Prescription - MHope Hospital",
        text: `Dear ${patient.fullName},\n\nPlease find attached your medical prescription from Dr. ${doctor.fullName}.\n\nBest regards,\nMHope Hospital`,
        attachments: [
          {
            filename: "prescription.pdf",
            path: pdfPath,
          },
        ],
      };

      console.log("Email configuration:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");

      // Delete temporary PDF file
      fs.unlinkSync(pdfPath);
      console.log("Temporary PDF file deleted");

      res.status(201).json({
        success: true,
        message: "Prescription created and sent successfully",
        prescription,
      });
    } catch (error) {
      console.error("Error in PDF generation or email sending:", error);
      // Even if PDF/email fails, we still want to return the prescription
      res.status(201).json({
        success: true,
        message:
          "Prescription created successfully but email could not be sent",
        prescription,
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    });
  }
};

// Get prescriptions by patient ID
export const getPrescriptionsByPatientId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.params.patientId,
    })
      .populate("doctorId", "fullName department")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

// Get prescriptions by doctor ID
export const getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      doctorId: req.params.doctorId,
    })
      .populate("patientId", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

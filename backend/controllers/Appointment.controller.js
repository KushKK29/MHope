import mongoose from "mongoose";
import Appointment from "../model/appointment.model.js";
import Patient from "../model/Patient.model.js";
import Doctor from "../model/Doctor.model.js";

export const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, service } = req.body;

  if (!patientId || !doctorId || !date || !time || !service) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      service,
      status: "pending",
      appointmentDate: new Date(`${date}T${time}`),
    });

    await appointment.save();

    await Promise.all([
      Doctor.findByIdAndUpdate(
        doctorId,
        { $addToSet: { appointments: appointment._id, patients: patientId } },
        { new: true }
      ),
      Patient.findByIdAndUpdate(
        patientId,
        { $addToSet: { appointments: appointment._id, doctors: doctorId } },
        { new: true }
      ),
    ]);

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "fullName email phone")
      .populate("doctorId", "fullName email department")
      .lean();

    const formattedAppointments = appointments.map((appointment) => ({
      _id: appointment._id,
      patientName: appointment.patientId?.fullName || "Unknown Patient",
      patientEmail: appointment.patientId?.email || "No email",
      patientPhone: appointment.patientId?.phone || "No phone",
      doctorName: appointment.doctorId?.fullName || "Unknown Doctor",
      department: appointment.doctorId?.department || "Unknown Department",
      appointmentDate:
        appointment.appointmentDate ||
        new Date(`${appointment.date}T${appointment.time}`),
      status: appointment.status || "pending",
      service: appointment.service,
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error in getAllAppointments:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAppointmentsByid = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Doctor ID" });
  }

  try {
    const appointments = await Appointment.find({
      $or: [{ doctorId: id }, { patientId: id }],
    })
      .populate("patientId", "fullName email phone gender")
      .populate("doctorId", "fullName email department")
      .lean();

    if (!appointments.length) {
      return res.status(200).json([]);
    }

    const formattedAppointments = appointments.map((appointment) => ({
      _id: appointment._id,
      patientName: appointment.patientId?.fullName || "Unknown Patient",
      patientEmail: appointment.patientId?.email || "No email",
      patientPhone: appointment.patientId?.phone || "No phone",
      patientGender: appointment.patientId?.gender || "Unknown",
      doctorName: appointment.doctorId?.fullName || "Unknown Doctor",
      department: appointment.doctorId?.department || "Unknown Department",
      appointmentDate:
        appointment.appointmentDate ||
        new Date(`${appointment.date}T${appointment.time}`),
      status: appointment.status || "pending",
      service: appointment.service,
    }));

    return res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error in getAppointmentsByid:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, status, service, notes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Appointment ID" });
  }

  try {
    const updateData = {};
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (service) updateData.service = service;
    if (notes !== undefined) updateData.notes = notes;

    if (date || time) {
      const existing = await Appointment.findById(id).lean();
      const newDate = date || existing.date;
      const newTime = time || existing.time;
      updateData.appointmentDate = new Date(`${newDate}T${newTime}`);
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("patientId", "fullName email phone")
      .populate("doctorId", "fullName email department");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const formattedAppointment = {
      _id: appointment._id,
      patientName: appointment.patientId?.fullName || "Unknown Patient",
      patientEmail: appointment.patientId?.email || "No email",
      patientPhone: appointment.patientId?.phone || "No phone",
      doctorName: appointment.doctorId?.fullName || "Unknown Doctor",
      department: appointment.doctorId?.department || "Unknown Department",
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      service: appointment.service,
    };

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: formattedAppointment,
    });
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Appointment ID" });
  }

  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

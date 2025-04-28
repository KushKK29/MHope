import Appointment from "../model/appointment.model.js";
import User from "../model/user.model.js";
export const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, service } = req.body;

  if (!patientId || !doctorId || !date || !time || !service) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      service,
      status: "Pending",
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const { role } = req.query;
    
    if (role!=="Admin") {
      return res
        .status(401)
        .json({
          message: "You are not authorised for the retrueving this data",
        });
    }

    const appointments = await Appointment.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName email")
      .lean();

    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAppointmentsByid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({ message: "id not available" });
    }
    const appointments = await Appointment.findById(id);
    if (!appointments) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json({ message: "Appointment found", appointments });
  } catch (error) {
    console.log("error at getAppointmentByid", error.message);
    return res.status(500).json({ message: "Interal Server error" });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, status, service, notes } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Appointment ID is required" });
  }

  try {
    // Create an update object with only the fields that are provided
    const updateData = {};
    if (date) updateData.date = date;
    if (time) updateData.time = time;
    if (status) updateData.status = status;
    if (service) updateData.service = service;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

 
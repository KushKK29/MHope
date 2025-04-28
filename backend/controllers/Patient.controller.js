import Patient from "../model/Patient.model.js";
import bcrypt from "bcryptjs";

export const createPatient = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingDoc = await Patient.findOne({ email }); // 🔧 Added await
    if (existingDoc) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Patient({
      fullName,
      email,
      password: hashedPassword,
      role: "Patient", // 💡 Include role in DB for clarity
    });

    await user.save(); // 🔧 Added await

    res.status(201).json({
      message: "Patient created successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error at create Patient" });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const { role } = req.query; // ✅ Change from req.user to req.query
    if (role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const patients = await Patient.find({ role: "Patient" }).select(
      "-password"
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "No Patients found" });
    }

    return res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error at getAllPatients" });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, address } = req.body;

    let updateData = {
      fullName,
      email,
      address,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const patient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

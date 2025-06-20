import Doctor from "../model/Doctor.model.js";
import bcrypt from "bcryptjs";
// createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor
export const createDoctor = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingDoc = await Doctor.findOne({ email }); // 🔧 Added await
    if (existingDoc) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Doctor({
      fullName,
      email,
      password: hashedPassword,
      role: "Doctor", // 💡 Include role in DB for clarity
    });

    await user.save(); // 🔧 Added await

    res.status(201).json({
      message: "Doctor created successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error at create doctor" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const { role } = req.query; // 🔧 Added query parameter for role
    // if (role !== "Admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const doctors = await Doctor.find({ role: "Doctor" }).select("-password");

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    return res.status(200).json({ doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      specialist,
      qualification,
      experience,
      address,
    } = req.body;

    let updateData = {
      fullName,
      email,
      specialist,
      qualification,
      experience,
      address,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

import Receptionist from "../model/Receptionist.model.js";
import bcrypt from "bcryptjs";

export const createReceptionist = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingReceptionist = await Receptionist.findOne({ email });
    if (existingReceptionist) {
      return res.status(400).json({ message: "Receptionist already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Receptionist({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Receptionist created successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error at create receptionist" });
  }
};

export const getAllReceptionist = async (req, res) => {
  try {
    const { role } = req.user.role;
    if (role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const receptionist = await Receptionist.find({
      role: "receptionist",
    }).select("-password");

    if (receptionist.length === 0) {
      return res.status(404).json({ message: "No receptionist found" });
    }

    return res.status(200).json({ receptionist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// updtae receptonist toh bilkul hi galat hai
export const updateReceptionist = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, qualification, experience, address } =
      req.body;

    let updateData = {
      fullName,
      email,
      qualification,
      experience,
      address,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const receptionist = await Receptionist.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!receptionist) {
      return res.status(404).json({ message: "Receptionist not found" });
    }

    return res.status(200).json({ receptionist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

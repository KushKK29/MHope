import User from "../model/user.model.js";
import Doctor from "../model/Doctor.model.js";
import Patient from "../model/Patient.model.js";
import Receptionist from "../model/Receptionist.model.js";
import bcrypt from "bcryptjs";
import { createDoctor, updateDoctor } from "./doctor.controller.js";
import { createPatient, updatePatient } from "./Patient.controller.js";
import {
  createReceptionist,
  updateReceptionist,
} from "./Receptionist.controller.js";

export const signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { fullName, email, password, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      console.log("Missing required fields:", {
        fullName,
        email,
        password,
        role,
      });
      return res.status(400).json({
        message: "Please fill all fields",
        missing: {
          fullName: !fullName,
          email: !email,
          password: !password,
          role: !role,
        },
      });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("Password too short");
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        passwordLength: password.length,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Check if user exists
    console.log("Checking if user exists with email:", email);
    const userExists = await Promise.all([
      User.findOne({ email }),
      Doctor.findOne({ email }),
      Receptionist.findOne({ email }),
      Patient.findOne({ email }),
    ]);

    if (userExists.some((user) => user !== null)) {
      console.log("User already exists with email:", email);
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Handle different roles
    console.log("Processing signup for role:", role);
    if (role === "Doctor") {
      return await createDoctor(req, res);
    } else if (role === "Patient") {
      return await createPatient(req, res);
    } else if (role === "Receptionist") {
      return await createReceptionist(req, res);
    } else if (role === "Admin") {
      console.log("Creating admin user");
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        fullName,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();
      console.log("Admin user created successfully");

      // Don't send password back in response
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      return res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } else {
      console.log("Invalid role provided:", role);
      return res.status(400).json({
        message: "Invalid role",
        allowedRoles: ["Doctor", "Patient", "Receptionist", "Admin"],
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal Server Error at signup",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Fill all the details for login" });
    }

    const user =
      (await User.findOne({ email })) ||
      (await Doctor.findOne({ email })) ||
      (await Receptionist.findOne({ email })) ||
      (await Patient.findOne({ email }));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    if (role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admins can access this resource" });
    }

    const admins = await User.find().select("-password");
    const doctors = await Doctor.find().select("-password");
    const patients = await Patient.find().select("-password");
    const receptionists = await Receptionist.find().select("-password");

    const allUsers = [
      ...admins.map((u) => ({ ...u._doc, role: "Admin" })),
      ...doctors.map((u) => ({ ...u._doc, role: "Doctor" })),
      ...patients.map((u) => ({ ...u._doc, role: "Patient" })),
      ...receptionists.map((u) => ({ ...u._doc, role: "Receptionist" })),
    ];

    res.status(200).json({ message: "Request successful", users: allUsers });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { role, email } = req.body;

    if (role !== "Admin") {
      return res.status(401).json({ message: "You cannot delete any user" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Cannot find user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted from server successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server error at delete user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      email,
      role,
      phone,
      address,
      specialist,
      experience,
      qualification,
    } = req.body;

    let updateData = {};

    if (role === "Admin") {
      updateData = {
        fullName,
        email,
        phone,
        address,
      };
    } else if (role === "Doctor") {
      updateData = {
        fullName,
        email,
        specialist,
        experience,
        qualification,
        address,
      };
    } else if (role === "Patient") {
      updateData = {
        fullName,
        email,
        phone,
        address,
      };
    } else if (role === "Receptionist") {
      updateData = {
        fullName: fullName,
        email: email,
        phone,
        address,
        qualification,
        experience,
      };
    } else {
      return res.status(404).json({ message: "Invalid role" });
    }

    let updatedUser;

    if (role === "Admin") {
      updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    } else if (role === "Doctor") {
      updatedUser = await Doctor.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } else if (role === "Patient") {
      updatedUser = await Patient.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } else if (role === "Receptionist") {
      updatedUser = await Receptionist.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    } else {
      return res.status(404).json({ message: "Internal error but in  try" });
    }
    res.status(200).json({ message: "Successfully updated", success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Internal server error at update user + ${error.message}`,
      success: false,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchCriteria = {
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    const [admins, doctors, patients, receptionists] = await Promise.all([
      User.find(searchCriteria),
      Doctor.find(searchCriteria),
      Patient.find(searchCriteria),
      Receptionist.find(searchCriteria),
    ]);

    const results = [
      ...admins.map((u) => ({ ...u._doc, role: "Admin" })),
      ...doctors.map((u) => ({ ...u._doc, role: "Doctor" })),
      ...patients.map((u) => ({ ...u._doc, role: "Patient" })),
      ...receptionists.map((u) => ({ ...u._doc, role: "Receptionist" })),
    ];

    res.status(200).json({ results });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error while searching users" });
  }
};

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const contextAdmin = createContext(null);

export const useAdmin = () => {
  return useContext(contextAdmin);
};

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const admin = JSON.parse(localStorage.getItem("user"));
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const handleSaveUser = async (updatedUserData) => {
    console.log("Updated data:", updatedUserData);
    console.log("User ID:", user._id);
    try {
      // Update user in backend
      await axios.put(
        `http://localhost:4000/api/user/updateUser/${user._id}`,
        updatedUserData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update local state
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUserData,
      }));

      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user: at admin context", error.message);
      toast.error("Failed to update user at admin context");
    }
  };

  // get all doctors
  const getAllDoctors = async () => {
    if (admin.role !== "Admin") {
      toast.error("You are not authorized to view this page");
      return;
    } else {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/doctor/getAllDoctors",
          {
            headers: { "Content-Type": "application/json" },
            params: { role: admin?.role },
          }
        );
        if (res.data) {
          setDoctors(res.data);
          toast.success("Doctors.data fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctors");
      }
    }
  };

  // delete doctor
  const deleteDoctor = async (doctor) => {
    console.log(admin);
    console.log(doctor);
    if (admin.role !== "Admin") {
      toast.error("Only admin can access this page");
      return;
    } else {
      try {
        const res = await axios.post(
          `http://localhost:4000/api/doctor/deleteDoctor/${doctor._id}`
        );
        if (res) {
          toast.success("Doctor Deleted Successfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("server Error", error.message);
      }
    }
  };

  const getAllPatients = async () => {
    console.log(admin);
    console.log(patients);
    if (admin.role !== "Admin") {
      toast.error("You are not authorized to view this page");
      return;
    } else {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/patient/getAllPatients",
          {
            headers: { "Content-Type": "application/json" },
            params: { role: admin?.role },
          }
        );
        if (res.data) {
          setPatients(res.data);
          toast.success("Patient.data fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to fetch patients");
      }
    }
  };

  const deletePatient = async (patient) => {
    console.log(admin);
    console.log(patient);
    if (admin.role !== "Admin") {
      toast.error("Only admin can access this page");
      return;
    } else {
      try {
        const res = await axios.post(
          `http://localhost:4000/api/patient/deletePatient/${patient._id}`
        );
        if (res) {
          setPatients((prev) => prev.filter((p) => p._id !== patient._id));
          toast.success("Patient Deleted Successfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("server Error", error.message);
      }
    }
  };

  const getAllAppointments = async () => {
    if (admin.role !== "Admin") {
      toast.error("You are not authorized to view this page");
    } else {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/appointment/getAllAppointments",
          {
            headers: { "Content-Type": "application/json" },
            params: { role: admin?.role },
          }
        );
        if (res.data) {
          setAppointments(res.data);
          toast.success("Patient.data fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to fetch patients");
      }
    }

    const deleteAppointment = async (id) => {
      console.log(id);
      try {
        const res = await axios.delete(
          `http://localhost:4000/api/appointment/deleteAppointment/${id}` // Use the correct endpoint for deleting an appointment,
        );
        if (res) {
          setAppointments((prev) => prev.filter((p) => p._id !== id));
          toast.success("Appointment Deleted Successfully");
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Error deleting appointment", error.message);
      }
    };

    return (
      <contextAdmin.Provider
        value={{
          user,
          setUser,
          handleSaveUser,
          getAllDoctors,
          doctors,
          deleteDoctor,
          getAllPatients,
          deletePatient,
          patients,
          setPatients,
          appointments,
          setAppointments,
          getAllAppointments,
          deleteAppointment,
        }}
      >
        {children}
      </contextAdmin.Provider>
    );
  };
};

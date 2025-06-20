import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const contextAdmin = createContext(null);

export const useAdmin = () => {
  return useContext(contextAdmin);
};

export const AdminProvider = ({ children }) => {
  const [badge, setBadge] = useState(false);
  const [user, setUser] = useState({});
  const admin = JSON.parse(localStorage.getItem("user") || "{}");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const handleSaveUser = async (updatedUserData) => {
    console.log("Updated data:", updatedUserData);
    console.log("User ID:", user._id);
    try {
      // Update user in backend
      const response = await axios.put(
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

      if (response.success) {
        toast.success("User updated successfully at context");
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        return response.data;
      }
      return updatedUserData;
    } catch (error) {
      console.error("Error updating user: at admin context", error.message);
      toast.error("Failed to update user");
      throw error;
    }
  };

  // get all doctors
  const getAllDoctors = async () => {
    // if (!admin || admin.role !== "Admin") {
    //   toast.error("You are not authorized to view this page");
    //   return [];
    // }

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
        toast.success("Doctors data fetched successfully");
        setDoctors(res.data);
        return res.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
      return [];
    }
  };

  // delete doctor
  const deleteDoctor = async (doctor) => {
    if (!admin || admin.role !== "Admin") {
      toast.error("Only admin can access this page");
      return null;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/api/doctor/deleteDoctor/${doctor._id}`
      );

      if (res.data) {
        // Update local state after successful deletion
        setDoctors((prev) => prev.filter((d) => d._id !== doctor._id));
        toast.success("Doctor Deleted Successfully");
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error(`Server Error: ${error.message}`);
      throw error;
    }
  };

  const getAllPatients = async () => {
    if (!admin || admin.role !== "Admin") {
      toast.error("You are not authorized to view this page");
      return [];
    }

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
        toast.success("Patient data fetched successfully");
        return res.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
      return [];
    }
  };

  const deletePatient = async (patient) => {
    if (!admin || admin.role !== "Admin") {
      toast.error("Only admin can access this page");
      return null;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/api/patient/deletePatient/${patient._id}`
      );

      if (res.data) {
        setPatients((prev) => prev.filter((p) => p._id !== patient._id));
        toast.success("Patient Deleted Successfully");
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error(`Server Error: ${error.message}`);
      throw error;
    }
  };

  const getAllAppointments = async () => {
    // if (!admin || admin.role !== "Admin") {
    //   toast.error("You are not authorized to view this page");
    //   return [];
    // }

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
        toast.success("Appointments fetched successfully");
        return res.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching Appointments:", error);
      toast.error("Failed to fetch appointments");
      return [];
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/appointment/deleteAppointment/${id}`
      );

      if (res.data) {
        setAppointments((prev) => prev.filter((p) => p._id !== id));
        toast.success("Appointment Deleted Successfully");
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(`Error deleting appointment: ${error.message}`);
      throw error;
    }
  };

  // create appointment
  const createAppointment = async (appointmentData) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/appointment/",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.data.success) {
        // Optionally refresh appointments list after creating
        if (typeof getAllAppointments === "function") {
          await getAllAppointments();
        }

        return {
          success: true,
          message: response.data.message,
          appointment: response.data.appointment,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to create appointment",
        };
      }
    } catch (error) {
      console.error("Error creating appointment:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          message: error.response.data?.message || "Server error occurred",
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          message: "Network error. Please check your connection.",
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: "An unexpected error occurred",
        };
      }
    }
  };

  // Reports functions with proper data return
  const overviewStats = async (dateRange) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/reports/overview`,
        {
          params: { dateRange },
        }
      );

      if (res.data) {
        console.log("Overview stats:", res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      toast.error("Failed to fetch overview stats");
      return null;
    }
  };

  const appointmentStat = async (dateRange) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/reports/appointments`,
        {
          params: { dateRange },
        }
      );

      if (res.data) {
        console.log("Appointment stats:", res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching appointment stats:", error);
      toast.error("Failed to fetch appointment stats");
      return null;
    }
  };

  const doctorStats = async (dateRange) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/reports/doctors`, {
        params: { dateRange },
      });

      if (res.data) {
        console.log("Doctor stats:", res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching doctor stats:", error);
      toast.error("Failed to fetch doctor stats");
      return null;
    }
  };

  const revenueStats = async (dateRange, revenue) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/reports/revenue`, {
        params: { dateRange },
      });

      if (res.data) {
        console.log("Revenue stats:", res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
      toast.error("Failed to fetch revenue stats");
      return null;
    }
  };

  const getOverview = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/overview");
      if (res.data) {
        console.log("successfull");
        return res.data;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const last7daysAppointment = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/last7appointments"
      );
      if (res.data) {
        console.log(res.data);
        return res.data;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const departmentWise = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/departmentwise"
      );
      if (res.data) {
        console.log("success");
        return res.data;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const newRegistration = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/admin/newregistrations"
      );
      if (res.data) {
        console.log("In context", res.data);
        return res.data;
      }
    } catch (error) {
      console.log(error);
      return null;
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
        overviewStats,
        appointmentStat,
        doctorStats,
        revenueStats,
        badge,
        setBadge,
        getOverview,
        last7daysAppointment,
        departmentWise,
        newRegistration,
        admin,
        createAppointment,
      }}
    >
      {children}
    </contextAdmin.Provider>
  );
};

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const doctorContext = createContext(null);

export const useDoctor = () => {
  return useContext(doctorContext);
};

export const DoctorProvider = ({ children }) => {
  const doctor = JSON.parse(localStorage.getItem("user") ?? "{}") || {};

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getAppointmentsByid = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/appointment/getAppointments/${id}` // Adjust the endpoint as needed
      );
      if (response.data) {
        console.log(response.data);
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(
        "Error getting appointments: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const AddPrescription = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/prescription/create",
        data
      );
      if (res.data.success) {
        toast.success("Pdf Sent to the patient's Email Successfully");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const createAppointment = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/appointment/",
        data
      );
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("Error creating appointment: " + error.message);
      return { success: false, message: error.message };
    }
  };

  return (
    <doctorContext.Provider
      value={{
        doctor,
        patients,
        setPatients,
        appointments,
        setAppointments,
        getAppointmentsByid,
        AddPrescription,
        createAppointment,
      }}
    >
      {children}
    </doctorContext.Provider>
  );
};

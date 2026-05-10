import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API_URL from "../config";

export const doctorContext = createContext(null);

export const useDoctor = () => {
  return useContext(doctorContext);
};

export const DoctorProvider = ({ children }) => {
  const userFromStorage = JSON.parse(localStorage.getItem("user") ?? "{}") || {};
  const doctor = {
    ...userFromStorage,
    _id: userFromStorage._id || userFromStorage.id,
  };

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getAllPatients = async () => {
    try {
      const res = await axios.get(`${API_URL}/patient/getAllPatients`);
      if (res.data) {
        setPatients(res.data.patients || res.data);
      }
    } catch (error) {
      console.error("Error fetching all patients:", error);
    }
  };

  const getAppointmentsByid = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/appointment/getAppointments/${id}` // Adjust the endpoint as needed
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
        `${API_URL}/prescription/create`,
        data
      );
      return res;
    } catch (error) {
      console.log(error.message);
      toast.error(`Error: ${error.message}`);
      return { data: { success: false, message: error.message } };
    }
  };

  const createAppointment = async (data) => {
    try {
      const res = await axios.post(
        `${API_URL}/appointment/`,
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
        getAllPatients,
        AddPrescription,
        createAppointment,
      }}
    >
      {children}
    </doctorContext.Provider>
  );
};

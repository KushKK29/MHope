import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Client } from "@gradio/client";
import React, { useEffect } from "react";
import Login from "./pages/Login";
import Home from "./Home";
import Unauthorized from "./pages/Unauthorized";
import Navbar from "./components/Navbar";
import GeminiChatbot from "./ChatBot";

// Admin
import ADashboard from "./pages/Admin/Dashboard";
import ManagePatients from "./pages/Admin/ManagePatients";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import ManageAppointments from "./pages/Admin/ManageAppointments";
import ManageUsers from "./pages/Admin/ManageUsers";
import Reports from "./pages/Admin/Reports";

// Receptionist
import RDashboard from "./pages/Receptionist/Dashboard";

// Doctor
import DDashboard from "./pages/Doctor/Dashboard";
import MyPatients from "./pages/Doctor/MyPatients";
import AddPrescription from "./pages/Doctor/AddPrescription";

// Patient
import PDashboard from "./pages/Patient/Dashboard";
import BookAppointment from "./pages/Patient/BookAppointment";
import MedicalRecords from "./pages/Patient/MedicalRecords";
import Invoices from "./pages/Patient/Invoices";

// Common
import Profile from "./pages/Profile";
import MoreInfo from "./pages/MoreInfo";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  

// const MODELS = [
//   "m-rafayali/chest_xray",
//   "Prakharjain31/Malaria-Detection",
//   "Mansoorhaider21/pneumonia_detection",
//   "DeepFieldML/Sentinel-P1_HIV_Prediction_Model",
// ];

// // Function to start the scheduler
// const startModelScheduler = () => {
//   // Call a single model
//   const callModel = async (space, input = null) => {
//     try {
//       const client = await Client.connect(space);
//       const result = await client.predict("/predict", {
//         text: "ping test",
//         image: null,
//       });
//       console.log(`[${space}]  Success`, result.data);
//     } catch (err) {
//       console.error(`[${space}]  Error`, err.message);
//     }
//   };

//   // Call all models once
//   const callAllModels = () => {
//     console.log(" Calling all models...");
//     MODELS.forEach((space) => callModel(space));
//   };

//   // Run immediately + repeat every 15 min
//   callAllModels();
//   setInterval(callAllModels, 15 * 60 * 1000);
// };
// useEffect(() => {
//     startModelScheduler(); // kicks off the 15-min scheduler
//   }, []);

  return (
    <>
      <div className="bg-white">
        <ToastContainer position="top-right" autoClose={3000} />
        {!isHome && !isLoginPage &&  <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ADashboard />} />
          <Route path="/admin/manage_user" element={<ManageUsers />} />
          <Route path="/admin/manage_patient" element={<ManagePatients />} />
          <Route path="/admin/manage_doctor" element={<ManageDoctors />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route
            path="/admin/manage_appointments"
            element={<ManageAppointments />}
          />

          {/* Receptionist */}
          <Route path="/receptionist/dashboard" element={<RDashboard />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DDashboard />} />
          <Route path="/doctor/mypatients" element={<MyPatients />} />
          <Route path="/doctor/prescription" element={<AddPrescription />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PDashboard />} />
          <Route
            path="/patient/book-appointment"
            element={<BookAppointment />}
          />
          <Route path="/patient/medical-records" element={<MedicalRecords />} />
          <Route path="/patient/invoices" element={<Invoices />} />

          {/* Common Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/moreinfo" element={<MoreInfo />} />
        </Routes>
        <GeminiChatbot />
      </div>
    </>
  );
}

export default App;

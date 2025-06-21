import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

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

  return (
    <>
      <div className="bg-white">
        <ToastContainer position="top-right" autoClose={3000} />
        {!isHome && <Navbar />}
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
        <GeminiChatbot apiKey="AIzaSyBvX1pXSK0h3ZANvyzeyNsje9FHSHFXp2U" />
      </div>
    </>
  );
}

export default App;

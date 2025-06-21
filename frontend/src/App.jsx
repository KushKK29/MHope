import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ROLES } from "./Roles";

import Login from "./pages/Login";
import Home from "./Home";
import Unauthorized from "./pages/Unauthorized";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
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
          <Route path="/unauthorised" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ADashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage_user"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage_patient"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ManagePatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage_doctor"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ManageDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage_appointments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ManageAppointments />
              </ProtectedRoute>
            }
          />

          {/* Receptionist */}
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <RDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <DDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/mypatients"
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <MyPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescription"
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <AddPrescription />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <PDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book-appointment"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/invoices"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <Invoices />
              </ProtectedRoute>
            }
          />

          {/* Common Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT, ROLES.RECEPTIONIST]}
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/moreinfo"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT, ROLES.RECEPTIONIST]}
              >
                <MoreInfo />
              </ProtectedRoute>
            }
          />
        </Routes>
        <GeminiChatbot apiKey="AIzaSyBvX1pXSK0h3ZANvyzeyNsje9FHSHFXp2U" />
      </div>
    </>
  );
}

export default App;

import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import RDashboard from "./pages/Receptionist/Dashboard";
import PDashboard from "./pages/Patient/Dashboard";
import DDashboard from "./pages/Doctor/Dashboard";
import ADashboard from "./pages/Admin/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import { ToastContainer } from "react-toastify";
import ManagePatients from "./pages/Admin/ManagePatients";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import ManageAppointments from "./pages/Admin/ManageAppointments";
import ManageUsers from "./pages/Admin/ManageUsers";
import Reports from "./pages/Admin/Reports";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import MoreInfo from "./pages/MoreInfo";
import MyPatients from "./pages/Doctor/MyPatients";
import AddPrescription from "./pages/Doctor/AddPrescription";
import BookAppointment from "./pages/Patient/BookAppointment";
import MedicalRecords from "./pages/Patient/MedicalRecords";
import Invoices from "./pages/Patient/Invoices";
import GeminiChatbot from "./ChatBot";
import Home from "./Home";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <>
      <div className="bg-white ">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Only show Navbar if not on Home page */}
        {!isHome && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/receptionist/dashboard"
            element={<RDashboard />}
          ></Route>
          <Route path="/admin/dashboard" element={<ADashboard />}></Route>
          <Route path="/admin/manage_user" element={<ManageUsers />}></Route>
          <Route
            path="/admin/manage_patient"
            element={<ManagePatients />}
          ></Route>
          <Route
            path="/admin/manage_doctor"
            element={<ManageDoctors />}
          ></Route>
          <Route path="/admin/reports" element={<Reports />}></Route>
          <Route
            path="/admin/manage_appointments"
            element={<ManageAppointments />}
          ></Route>

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PDashboard />}></Route>
          <Route
            path="/patient/book-appointment"
            element={<BookAppointment />}
          ></Route>
          <Route
            path="/patient/medical-records"
            element={<MedicalRecords />}
          ></Route>
          <Route path="/patient/invoices" element={<Invoices />}></Route>

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DDashboard />}></Route>
          <Route path="/doctor/mypatients" element={<MyPatients />}></Route>
          <Route
            path="/doctor/prescription"
            element={<AddPrescription />}
          ></Route>

          {/* Common Routes */}
          <Route path="/unauthorised" element={<Unauthorized />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/moreinfo" element={<MoreInfo />}></Route>
        </Routes>
        <GeminiChatbot apiKey="AIzaSyBvX1pXSK0h3ZANvyzeyNsje9FHSHFXp2U" />
      </div>
    </>
  );
}

export default App;

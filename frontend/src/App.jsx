import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <div className="bg-white ">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar></Navbar>
        <Routes>
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
          <Route path="/patient/dashboard" element={<PDashboard />}></Route>
          <Route path="/unauthorised" element={<Unauthorized />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/moreinfo" element={<MoreInfo />}></Route>
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DDashboard />}></Route>
          <Route path="/doctor/mypatients" element={<MyPatients />}></Route>
          <Route
            path="/doctor/prescription"
            element={<AddPrescription />}
          ></Route>
          {/* <Route
            path="/doctor/doctorProfile"
            element={<DoctorProfile />}
          ></Route> */}
          
        </Routes>
      </div>
    </>
  );
}

export default App;

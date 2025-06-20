import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { useDoctor } from "../../context/doctorContext";
import { useAdmin } from "../../context/adminContext";

const MedicalRecords = () => {
  const { getAppointmentsByid, appointments } = useDoctor();
  const { admin } = useAdmin();
  const [apptLoading, setApptLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")) || admin;
        setApptLoading(true);
        if (user && user._id) {
          const result = await getAppointmentsByid(user._id);
          // Debug log for API response
          console.log("Fetched appointments:", result, appointments);
        }
        setApptLoading(false);
      } catch (error) {
        toast.error("Failed to fetch appointments");
        setApptLoading(false);
      }
    };
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  // Sort appointments: upcoming first, then past
  const now = new Date();
  const sortedAppointments = [...(appointments || [])].sort((a, b) => {
    const aDate = new Date(a.appointmentDate);
    const bDate = new Date(b.appointmentDate);
    // Upcoming first
    if (aDate >= now && bDate < now) return -1;
    if (aDate < now && bDate >= now) return 1;
    // Both future or both past: most recent first
    return bDate - aDate;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Appointments
          </h2>
          {apptLoading ? (
            <div className="flex items-center justify-center min-h-[120px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center mb-8">
              <p className="text-gray-600">No appointments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="px-4 py-2">Doctor</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppointments.map((appt) => {
                    const apptDate = new Date(appt.appointmentDate);
                    return (
                      <tr
                        key={appt._id}
                        className="border-b hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-4 py-2 font-medium">
                          {appt.doctorName}
                        </td>
                        <td className="px-4 py-2">{appt.department}</td>
                        <td className="px-4 py-2">{appt.service}</td>
                        <td className="px-4 py-2">
                          {apptDate.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {apptDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              apptDate >= now
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;

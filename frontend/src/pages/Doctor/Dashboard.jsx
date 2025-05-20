import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import StatCard from "../../components/StatCard";
import {
  MdPerson2,
  MdEventNote,
  MdPendingActions,
  MdCheckCircle,
} from "react-icons/md";
import { Datepicker } from "flowbite-react";
import Appointment_Schedule from "../../components/AppointmentSchedule";
import { useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { useDoctor } from "../../context/doctorContext";

const Dashboard = () => {
  const { getAppointmentsByid, setAppointments, appointments, doctor } =
    useDoctor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter by date
  let filteredData = appointments
    .filter((item) => {
      const apptDate = new Date(item.appointmentDate);
      return apptDate.toDateString() === new Date(selectedDate).toDateString();
    })
    .sort((a, b) => {
      const getTimeValue = (date) => {
        const d = new Date(date);
        return d.getHours() * 60 + d.getMinutes();
      };
      return getTimeValue(a.appointmentDate) - getTimeValue(b.appointmentDate);
    });

  // Search filtering
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.patientName?.toLowerCase().includes(q) ||
        item.doctorName?.toLowerCase().includes(q) ||
        item.service?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
    );
  }

  // Calculate statistics
  const totalPatients = new Set(appointments.map((app) => app.patientName))
    .size;
  const todayAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    const today = new Date();
    return appDate.toDateString() === today.toDateString();
  }).length;
  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  ).length;
  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  ).length;

  useEffect(() => {
    const getAppointments = async () => {
      if (doctor?._id) {
        await getAppointmentsByid(doctor._id);
      }
    };
    getAppointments();
  }, [doctor?._id]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-600">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-9 text-gray-800 border-b pb-3">
            Welcome Dr.{" "}
            <span className="text-blue-500">{doctor?.fullName}</span>
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Patients"
              value={totalPatients.toString()}
              icon={<MdPerson2 size={22} />}
            />
            <StatCard
              title="Today's Appointments"
              value={todayAppointments.toString()}
              icon={<MdEventNote size={22} />}
            />
            <StatCard
              title="Pending Appointments"
              value={pendingAppointments.toString()}
              icon={<MdPendingActions size={22} />}
            />
            <StatCard
              title="Completed Appointments"
              value={completedAppointments.toString()}
              icon={<MdCheckCircle size={22} />}
            />
          </div>
          <div className="p-4 md:p-8 bg-white min-h-[60vh] rounded-2xl shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 border-b pb-3 mb-6">
              Today's Schedule
            </h1>
            <div className="bg-gradient-to-br from-blue-200 to-sky-300 rounded-2xl shadow-md p-4 md:p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Search
                </label>
                <TextInput
                  id="search"
                  type="text"
                  sizing="md"
                  placeholder="Search by patient name, service, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col justify-center">
                <label
                  htmlFor="schedule-date"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Select Date
                </label>
                <Datepicker
                  title="Choose Date"
                  id="schedule-date"
                  className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  onChange={(date) => {
                    setSelectedDate(date);
                  }}
                  defaultDate={new Date()}
                />
              </div>
            </div>
            <div className="p-2 m-3">
              {filteredData && filteredData.length > 0 ? (
                <Appointment_Schedule data={filteredData} />
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <span className="text-2xl">🗓️</span>
                  <div className="mt-2 text-lg">
                    No appointments found for the selected date.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

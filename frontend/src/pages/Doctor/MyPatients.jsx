import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Assuming you have a Sidebar component
import {
  FaEye,
  FaUserFriends,
  FaVenusMars,
  FaCalendarCheck,
  FaClipboardList,
} from "react-icons/fa";
import {
  MagnifyingGlassIcon,
  UserIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../../components/StatCard"; // Assuming StatCard component path
import { Datepicker } from "flowbite-react"; // Added for date filter
import PieChartComponent from "../../components/PieChart"; // Assuming you have a PieChart component
import { useDoctor } from "../../context/doctorContext"; // Assuming you have a doctor context
// Helper function to get today's date in YYYY-MM-DD format
const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Mock data for patients - replace with API call in a real application
const mockPatients = [
  {
    id: 1,
    name: "Alice Smith",
    age: 34,
    lastVisit: "2024-03-15",
    diagnosis: "Common Cold",
    gender: "Female",
    lastAppointmentDate: "2024-07-27",
    status: "Completed Treatment",
  },
  {
    id: 2,
    name: "Bob Johnson",
    age: 45,
    lastVisit: "2024-07-10",
    diagnosis: "Flu",
    gender: "Male",
    lastAppointmentDate: getTodaysDate(),
    status: "Active Monitoring",
  },
  {
    id: 3,
    name: "Carol Williams",
    age: 28,
    lastVisit: "2023-02-20",
    diagnosis: "Allergy",
    gender: "Female",
    lastAppointmentDate: "2024-07-25",
    status: "Pending Follow-up",
  },
  {
    id: 4,
    name: "David Brown",
    age: 52,
    lastVisit: "2024-06-01",
    diagnosis: "Routine Checkup",
    gender: "Male",
    lastAppointmentDate: getTodaysDate(),
    status: "Completed Treatment",
  },
  {
    id: 5,
    name: "Eve Davis",
    age: 60,
    lastVisit: "2024-01-25",
    diagnosis: "Hypertension",
    gender: "Female",
    lastAppointmentDate: "2024-07-20",
    status: "Active Monitoring",
  },
  {
    id: 6,
    name: "Frank Green",
    age: 30,
    lastVisit: "2024-04-01",
    diagnosis: "Sprained Ankle",
    gender: "Male",
    lastAppointmentDate: "2024-07-28",
    status: "Pending Follow-up",
  },
  {
    id: 7,
    name: "Grace Hall",
    age: 22,
    lastVisit: "2024-07-05",
    diagnosis: "Migraine",
    gender: "Female",
    lastAppointmentDate: getTodaysDate(),
    status: "Completed Treatment",
  },
  {
    id: 8,
    name: "Henry King",
    age: 70,
    lastVisit: "2023-03-20",
    diagnosis: "Arthritis",
    gender: "Male",
    lastAppointmentDate: "2024-06-15",
    status: "Active Monitoring",
  },
  {
    id: 9,
    name: "Ivy Walker",
    age: 38,
    lastVisit: "2024-05-10",
    diagnosis: "Diabetes Management",
    gender: "Female",
    lastAppointmentDate: "2024-07-29",
    status: "Pending Follow-up",
  },
  {
    id: 10,
    name: "Jack White",
    age: 42,
    lastVisit: "2024-07-22",
    diagnosis: "Back Pain",
    gender: "Male",
    lastAppointmentDate: "2024-07-22",
    status: "Completed Treatment",
  },
];

const MyPatients = () => {
  const { getAppointmentsByid, appointments, doctor } = useDoctor();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const patientsPerPage = 5;

  const [filteredAndSortedPatients, setFilteredAndSortedPatients] = useState(
    []
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      if (doctor?._id) {
        setIsLoading(true);
        await getAppointmentsByid(doctor._id);
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [doctor?._id]);

  useEffect(() => {
    if (!isLoading && appointments.length > 0) {
      // Transform appointments into unique patients
      const uniquePatients = Array.from(
        new Map(
          appointments.map((appointment) => [
            appointment._id,
            {
              id: appointment._id,
              name: appointment.patientName,
              email: appointment.patientEmail,
              phone: appointment.patientPhone,
              gender: appointment.patientGender,
              lastVisit: new Date(
                appointment.appointmentDate
              ).toLocaleDateString(),
              service: appointment.service,
              status: appointment.status,
              department: appointment.department,
            },
          ])
        ).values()
      );

      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = uniquePatients.filter((patient) => {
        const matchesSearch =
          patient.name?.toLowerCase().includes(lowercasedQuery) ||
          patient.email?.toLowerCase().includes(lowercasedQuery) ||
          patient.phone?.includes(lowercasedQuery) ||
          patient.service?.toLowerCase().includes(lowercasedQuery);
        const matchesGender =
          selectedGender === "all" || patient.gender === selectedGender;
        const matchesStatus =
          selectedStatus === "All Statuses" ||
          patient.status === selectedStatus;

        return matchesSearch && matchesGender && matchesStatus;
      });

      // Sort patients by their last visit date (most recent first)
      const sortedPatients = filtered.sort((a, b) => {
        return new Date(b.lastVisit) - new Date(a.lastVisit);
      });

      setFilteredAndSortedPatients(sortedPatients);
      setCurrentPage(1);
    }
  }, [searchQuery, selectedGender, selectedStatus, appointments, isLoading]);

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentDisplayPatients = filteredAndSortedPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(
    filteredAndSortedPatients.length / patientsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewHistory = (patientId) => {
    console.log(`View history for patient ${patientId}`);
  };

  const todaysAppointmentsCount = appointments.filter(
    (app) =>
      new Date(app.appointmentDate).toDateString() === new Date().toDateString()
  ).length;

  const malePatientsCount = filteredAndSortedPatients.filter(
    (p) => p.gender === "Male"
  ).length;
  const femalePatientsCount = filteredAndSortedPatients.filter(
    (p) => p.gender === "Female"
  ).length;
  const pendingFollowUpCount = filteredAndSortedPatients.filter(
    (p) => p.status === "pending"
  ).length;

  const pieData = [
    { name: "Male", value: malePatientsCount },
    { name: "Female", value: femalePatientsCount },
  ];
  const pieData2 = [
    { name: "Total Patients", value: filteredAndSortedPatients.length },
    {
      name: "Active Monitoring",
      value: filteredAndSortedPatients.filter((p) => p.status === "confirmed")
        .length,
    },
    {
      name: "Completed Treatment",
      value: filteredAndSortedPatients.filter((p) => p.status === "completed")
        .length,
    },
    {
      name: "Pending Follow-up",
      value: filteredAndSortedPatients.filter((p) => p.status === "pending")
        .length,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (filteredAndSortedPatients.length === 0) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <FaUserFriends className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Patients Found
          </h2>
          <p className="text-gray-500">
            When patients are assigned to you, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            My Patients
          </h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Patients"
              value={filteredAndSortedPatients.length}
              icon={<FaUserFriends className="text-blue-500" size={24} />}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
            <StatCard
              title="Today's Appointments"
              value={todaysAppointmentsCount}
              icon={<FaCalendarCheck className="text-green-500" size={24} />}
              bgColor="bg-green-50"
              textColor="text-green-700"
            />
            <StatCard
              title="Pending Follow-ups"
              value={pendingFollowUpCount}
              icon={<FaClipboardList className="text-orange-500" size={24} />}
              bgColor="bg-orange-50"
              textColor="text-orange-700"
            />
          </div>
          <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-4">
              Patient Gender Distribution
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <PieChartComponent data={pieData} />
              </div>
              <div>
                <PieChartComponent data={pieData2} />
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="relative md:col-span-1">
                <label
                  htmlFor="search-patient"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Patient
                </label>
                <div className="absolute inset-y-0 left-0 top-6 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  id="search-patient"
                  className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Name, email, phone, service..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="gender-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender-filter"
                  className="w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Patient Status
                </label>
                <select
                  id="status-filter"
                  className="w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {[
                    "All Statuses",
                    ...new Set(filteredAndSortedPatients.map((p) => p.status)),
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    {[
                      "Patient Name",
                      "Contact Info",
                      "Service",
                      "Last Visit",
                      "Status",
                      "Actions",
                    ].map((header, index) => (
                      <th
                        key={`header-${index}`}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          header === "Actions" ? "text-center" : ""
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDisplayPatients.length > 0 ? (
                    currentDisplayPatients.map((patient) => (
                      <tr
                        key={`patient-${patient.id}`}
                        className="hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div
                                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                                  patient.gender === "Male"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-pink-100 text-pink-700"
                                }`}
                              >
                                {patient.name?.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {patient.gender}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {patient.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {patient.lastVisit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              patient.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : patient.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleViewHistory(patient.id)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 flex items-center justify-center gap-1.5 py-2 px-4 rounded-md hover:bg-indigo-100 border border-indigo-500 hover:border-indigo-700 text-xs font-semibold"
                            title="View History"
                          >
                            <FaEye className="w-4 h-4" />
                            View History
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key="no-patients">
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium">
                            No patients found.
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Section */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstPatient + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        indexOfLastPatient,
                        filteredAndSortedPatients.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredAndSortedPatients.length}
                    </span>{" "}
                    patients
                  </p>
                  <div className="flex space-x-1">
                    <button
                      key="prev-button"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 text-sm rounded ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1) ? (
                          <button
                            key={`page-${page}`}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1.5 text-sm rounded ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        ) : page === currentPage - 2 ||
                          page === currentPage + 2 ? (
                          <span
                            key={`ellipsis-${page}`}
                            className="px-1.5 py-1.5 text-gray-500"
                          >
                            ...
                          </span>
                        ) : null
                    )}
                    <button
                      key="next-button"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 text-sm rounded ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPatients;

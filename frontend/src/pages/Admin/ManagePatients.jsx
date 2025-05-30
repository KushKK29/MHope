import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import StatCard from "../../components/StatCard";
import { useAdmin } from "../../context/adminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/solid";

const ManagePatients = () => {
  const navigate = useNavigate();
  const { patients, getAllPatients, deletePatient, setUser } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter patients based on search query and category
  const filteredPatients = patients?.patients?.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || patient.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 8;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients?.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = filteredPatients
    ? Math.ceil(filteredPatients.length / patientsPerPage)
    : 0;

  useEffect(() => {
    const fetchPatients = async () => {
      await getAllPatients();
    };
    fetchPatients();
  }, []);

  // Reset to first page when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Handle delete patient
  const handleDelete = async (e, patient) => {
    e.stopPropagation(); // Prevent row click when delete button is clicked
    try {
      const res = await deletePatient(patient);
      if (res) {
        toast.success("Patient Deleted Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Server Error: ${error.message}`);
    }
  };

  // Navigate to patient profile
  const navigateToProfile = (patient) => {
    setUser(patient);
    navigate("/profile");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Patients
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage all patient records in the system
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatCard
              title="Total Patients"
              value={patients?.patients?.length || 0}
              icon={<UserIcon className=" text-indigo-600" />}
              bgColor="bg-indigo-50"
              textColor="text-indigo-700"
            />
            <StatCard
              title="Active Appointments"
              value={
                patients?.patients?.filter((p) => p.hasActiveAppointment)
                  ?.length || 0
              }
              icon={<EnvelopeIcon className=" text-emerald-600" />}
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
            <StatCard
              title="New Patients This Month"
              value={
                patients?.patients?.filter((p) => {
                  const createdDate = new Date(p.createdAt);
                  const currentDate = new Date();
                  return (
                    createdDate.getMonth() === currentDate.getMonth() &&
                    createdDate.getFullYear() === currentDate.getFullYear()
                  );
                })?.length || 0
              }
              icon={<PhoneIcon className=" text-blue-600" />}
              bgColor="bg-blue-50"
              textColor="text-blue-700"
            />
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search patients by name, email or phone..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
            <div className="w-full md:w-56">
              <select
                className="w-full p-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Heart">Heart</option>
                <option value="Lungs">Lungs</option>
                <option value="Bones">Bones</option>
                <option value="Eyes">Eyes</option>
                <option value="Brain">Brain</option>
                <option value="E.N.T.">E.N.T</option>
                <option value="Physiciast">Physiciast</option>
                <option value="Psychologist">Psychologist</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white uppercase bg-indigo-600">
                  <tr>
                    <th className="px-6 py-3">Patient Name</th>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3">Phone Number</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients && currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="border-b cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigateToProfile(patient)}
                      >
                        <td className="px-4 py-2 font-medium">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                              {patient.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {patient.fullName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {patient.category || "No category"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {patient.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {patient.phone}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateToProfile(patient);
                              }}
                            >
                              View
                            </button>
                            <button
                              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                              onClick={(e) => handleDelete(e, patient)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "No patients found matching your search"
                          : "No patients available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {filteredPatients && filteredPatients.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {indexOfFirstPatient + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastPatient, filteredPatients.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredPatients.length}
                    </span>{" "}
                    patients
                  </p>

                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show current page, first, last, and pages close to current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          indexOfLastPatient < filteredPatients.length
                            ? prev + 1
                            : prev
                        )
                      }
                      disabled={indexOfLastPatient >= filteredPatients.length}
                      className={`px-3 py-1 text-sm rounded ${
                        indexOfLastPatient >= filteredPatients.length
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

export default ManagePatients;

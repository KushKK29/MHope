import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import StatCard from "../../components/StatCard";
import { useAdmin } from "../../context/adminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageDoctors = () => {
  const admin = useAdmin();
  const navigate = useNavigate();
  const { doctors, getAllDoctors, deleteDoctor } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredDoctors = doctors?.doctors?.filter(
    (doctor) =>
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // agination
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors?.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      await getAllDoctors(); // Context should handle admin internally
    };
    fetchDoctors();
  }, []);

  // controlling delete in manage doctor
  const handelDelete = async (doctor) => {
    try {
      const res = await deleteDoctor(doctor);
      if (res) {
        toast.success("Doctor Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("server Error", error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-scree">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-200 to-indigo-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Manage Doctors</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <StatCard title="Total Doctors" value={doctors?.doctors?.length} />
            <StatCard title="Total active" value="0" />{" "}
            {/*ye baad me karunga */}
          </div>
          <div className="relative mb-6 border-gray-400 border-1 rounded-md">
            <div className="absolute inset-y-0 left-0 flex  items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users by name, email or role..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray rounded-lg border-[2px] border-gray-300 ">
              <thead className="bg-green-600 text-xs text-white uppercase rounded-t-lg">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Specialist</th>
                  <th className="px-6 py-3">Experience</th>
                  <th className="px-6 py-3">
                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2">
                      <option value="all">All</option>
                      <option value="Heart">Heart</option>
                      <option value="Lungs">Lungs</option>
                      <option value="Bones">Bones</option>
                      <option value="Eyes">Eyes</option>
                      <option value="Brain">Brain</option>
                      <option value="E.N.T."> E.N.T/</option>
                      <option value="Physiciast">Physiciast/</option>
                      <option value="Psychologist">Psychologist/</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors?.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="bg-white border-b border-gray-400 hover:border-gray-300"
                    onClick={() => {
                      admin.setUser(doctor);
                      navigate("/profile");
                    }}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      {doctor.fullName}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      {doctor.phone}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      {doctor.specialist}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      {doctor.experience}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handelDelete(doctor)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-semibold">{currentPage}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    indexOfLastDoctor < filteredDoctors?.length
                      ? prev + 1
                      : prev
                  )
                }
                disabled={indexOfLastDoctor >= filteredDoctors?.length}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;

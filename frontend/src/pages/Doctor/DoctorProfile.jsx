import React from "react";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaMedkit,
  FaCalendarCheck,
  FaUserMd,
  FaCertificate,
  FaClock,
} from "react-icons/fa";
import Sidebar from "../Doctor/Sidebar";
import { useDoctor } from "../../context/doctorContext";

const DoctorProfile = () => {
  const { doctor } = useDoctor();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-5xl text-gray-300 mb-4">🔍</div>
          <p className="text-xl text-gray-600">Doctor profile not found</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Return to Doctors List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              {/* Banner & Profile Image */}
              <div className="relative">
                <div className="h-56 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                <div className="absolute top-32 left-8 md:left-10 flex items-end">
                  <div className="h-36 w-36 md:h-44 md:w-44 rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img
                      src={
                        doctor.profileImage || "https://via.placeholder.com/150"
                      }
                      alt={doctor.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 md:hidden pb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {doctor.availability}
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <span className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaClock className="mr-1" /> {doctor.availability}
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="pt-24 md:pt-28 px-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      Dr. {doctor.fullName}
                    </h1>
                    <p className="text-lg text-indigo-700 font-medium">
                      {doctor.specialist}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className="flex mr-2">
                        {renderStars(doctor.rating)}
                      </div>
                      <span className="text-gray-600 font-medium">
                        ({doctor.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right">
                    <div className="inline-block bg-indigo-50 rounded-lg px-4 py-2">
                      <p className="text-sm text-indigo-600 font-medium">
                        Consultation Fee
                      </p>
                      <p className="text-2xl font-bold text-indigo-700">
                        ₹{doctor.consultationFee}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 transition-all hover:shadow-md">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-100 p-3 mr-4">
                        <FaUserMd className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-900">
                          Experience
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-blue-700">
                          {doctor.experience} Years
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 transition-all hover:shadow-md">
                    <div className="flex items-center">
                      <div className="rounded-full bg-purple-100 p-3 mr-4">
                        <FaCertificate className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-purple-900">
                          Qualification
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-purple-700">
                          {doctor.qualification}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100 transition-all hover:shadow-md">
                    <div className="flex items-center">
                      <div className="rounded-full bg-green-100 p-3 mr-4">
                        <FaMedkit className="text-green-600 text-xl" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-900">
                          Specialization
                        </h3>
                        <p className="mt-1 text-lg font-semibold text-green-700">
                          {doctor.specialist}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <FaPhoneAlt className="text-indigo-700" />
                    </span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <FaEnvelope className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="mt-1 text-gray-900 font-medium">
                          {doctor.email}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <FaPhoneAlt className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="mt-1 text-gray-900 font-medium">
                          {doctor.phone}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="mt-1 text-gray-900">
                          {doctor.address.street}, {doctor.address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      (window.location.href = `/appointment/create/${doctor._id}`)
                    }
                    className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <FaCalendarCheck className="mr-2" /> Book Appointment
                  </button>
                  <button className="flex-1 border-2 border-indigo-600 text-indigo-600 px-6 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center">
                    <FaStar className="mr-2" /> View Patient Reviews
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* About */}
              <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About Dr. {doctor.fullName}
                </h3>
                <p className="text-gray-600">
                  {doctor.bio ||
                    "Dr. " +
                      doctor.fullName +
                      " is a highly skilled and experienced " +
                      doctor.specialist +
                      " with " +
                      doctor.experience +
                      " years of experience in the field. " +
                      "They are committed to providing the highest quality care to their patients."}
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Languages
                    </h4>
                    <p className="mt-1 text-gray-800">English, Hindi</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Working Hours
                    </h4>
                    <p className="mt-1 text-gray-800">
                      Mon-Fri: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Patients Treated
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        500+
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full w-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Success Rate
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        98%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full w-11/12"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Patient Satisfaction
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {doctor.rating.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(doctor.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

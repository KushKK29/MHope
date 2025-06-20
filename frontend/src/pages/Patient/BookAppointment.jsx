import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { useAdmin } from "../../context/adminContext";
import { HiCalendar, HiClock, HiUser, HiClipboardCheck } from "react-icons/hi";
import { MdLocalHospital } from "react-icons/md";

const BookAppointment = () => {
  const { getAllDoctors, doctors, createAppointment, admin } = useAdmin();
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setDoctorsLoading(true);
      if (!doctors || doctors.length === 0) {
        await getAllDoctors();
      }
      setDoctorsLoading(false);
    };
    fetchDoctors();
  }, [getAllDoctors, doctors]);

  // Service options
  const serviceOptions = [
    "General Consultation",
    "Checkup",
    "Follow-up",
    "Emergency",
    "Surgery Consultation",
    "Diagnostic",
    "Vaccination",
    "Physical Therapy",
    "Mental Health",
    "Specialist Consultation",
  ];

  // Time slots
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const displayHour =
      hourInt > 12 ? hourInt - 12 : hourInt === 0 ? 12 : hourInt;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get patient/user data from localStorage or admin context
      const user = JSON.parse(localStorage.getItem("user")) || admin;

      if (!user || !user._id) {
        toast.error("User information not found. Please login again.");
        return;
      }

      const appointmentData = {
        patientId: user._id,
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
      };

      const result = await createAppointment(appointmentData);

      if (result.success) {
        toast.success("Appointment booked successfully!");
        // Reset form
        setSelectedDoctor("");
        setSelectedDate("");
        setSelectedTime("");
        setSelectedService("");
      } else {
        toast.error(result.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Defensive extraction of doctors array
  const doctorsArray = Array.isArray(doctors)
    ? doctors
    : doctors && Array.isArray(doctors.doctors)
    ? doctors.doctors
    : [];

  const selectedDoctorInfo = doctorsArray.find(
    (doctor) => doctor._id === selectedDoctor
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <HiCalendar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Book an Appointment
                </h1>
                <p className="text-gray-600 mt-1">
                  Schedule your appointment with our experienced doctors
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <HiClipboardCheck className="text-blue-500 mr-2" />
                Appointment Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HiUser className="inline mr-1" />
                    Select Doctor
                  </label>
                  {doctorsLoading ? (
                    <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctorsArray.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.fullName} -{" "}
                          {doctor.specialist || doctor.specialization}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MdLocalHospital className="inline mr-1" />
                    Service Type
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                  >
                    <option value="">Select service type</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HiCalendar className="inline mr-1" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                    required
                    min={today}
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HiClock className="inline mr-1" />
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-blue-500 text-white border-blue-500 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all duration-200 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking Appointment...
                    </div>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </form>
            </div>

            {/* Appointment Summary */}
            <div className="space-y-6">
              {/* Selected Doctor Info */}
              {selectedDoctorInfo && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selected Doctor
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                      <HiUser className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {selectedDoctorInfo.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDoctorInfo.specialist ||
                          selectedDoctorInfo.specialization}
                      </p>
                      {selectedDoctorInfo.email && (
                        <p className="text-sm text-gray-500">
                          {selectedDoctorInfo.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Appointment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-800">
                      {selectedService || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDate || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-800">
                      {selectedTime ? formatTime(selectedTime) : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Important Notes:
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Please arrive 15 minutes before your appointment</li>
                  <li>• Bring all relevant medical records</li>
                  <li>
                    • Appointments can be rescheduled up to 24 hours in advance
                  </li>
                  <li>• Contact support for any urgent concerns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

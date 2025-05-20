import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDoctor } from "../context/DoctorContext";
import Sidebar from "./Doctor/Sidebar";
import {
  FaCalendarAlt,
  FaClock,
  FaNotesMedical,
  FaUserMd,
  FaMoneyBillWave,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const CreateAppointment = () => {
  const navigate = useNavigate();
  const { doctor, createAppointment } = useDoctor();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState("consultation");

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  useEffect(() => {
    const getRandomAvailability = () => {
      const shuffled = timeSlots.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.floor(Math.random() * timeSlots.length));
    };
    setAvailableSlots(getRandomAvailability());
  }, [selectedDate]);

  const validateStep1 = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return false;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return false;
    }
    if (!appointmentType) {
      toast.error("Please select appointment type");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(contactNumber)) {
      toast.error("Please enter a valid 10-digit contact number");
      return false;
    }

    if (!patientName.trim()) {
      toast.error("Please enter patient name");
      return false;
    }
    if (!contactNumber.trim()) {
      toast.error("Please enter contact number");
      return false;
    }
    if (!email.trim()) {
      toast.error("Please enter email address");
      return false;
    }
    if (hasInsurance && !insuranceProvider.trim()) {
      toast.error("Please enter insurance provider");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please enter reason for visit");
      return;
    }

    setIsSubmitting(true);

    try {
      const appointmentData = {
        doctor,
        date: selectedDate,
        time: selectedTime,
        reason,
        patientName,
        contactNumber,
        email,
        hasInsurance,
        insuranceProvider: hasInsurance ? insuranceProvider : null,
        emergencyContact,
        appointmentType,
      };

      const data = await createAppointment(appointmentData);

      if (data.success) {
        toast.success("Appointment booked successfully!");
        setStep(1);
        setSelectedDate(new Date());
        setSelectedTime("");
        setReason("");
        setPatientName("");
        setContactNumber("");
        setEmail("");
        setHasInsurance(false);
        setInsuranceProvider("");
        setEmergencyContact("");
        setAppointmentType("consultation");
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("Error booking appointment: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-5xl text-gray-300 mb-4">
            <FaExclamationTriangle className="mx-auto text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 mb-4">Doctor profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-indigo-800 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Select Appointment Details
            </h2>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAppointmentType("consultation")}
                  className={`p-3 rounded-lg flex flex-col items-center hover:shadow-md transition-all ${
                    appointmentType === "consultation"
                      ? "bg-indigo-100 border-2 border-indigo-500"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <FaUserMd
                    className={`text-2xl ${
                      appointmentType === "consultation"
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="mt-2 font-medium">Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentType("follow-up")}
                  className={`p-3 rounded-lg flex flex-col items-center hover:shadow-md transition-all ${
                    appointmentType === "follow-up"
                      ? "bg-indigo-100 border-2 border-indigo-500"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <FaCheckCircle
                    className={`text-2xl ${
                      appointmentType === "follow-up"
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="mt-2 font-medium">Follow-up</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAppointmentType("emergency")}
                  className={`p-3 rounded-lg flex flex-col items-center hover:shadow-md transition-all ${
                    appointmentType === "emergency"
                      ? "bg-indigo-100 border-2 border-indigo-500"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <FaExclamationTriangle
                    className={`text-2xl ${
                      appointmentType === "emergency"
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="mt-2 font-medium">Emergency</span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600" /> Select Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
                  dateFormat="MMMM d, yyyy"
                  calendarClassName="font-sans"
                  inline
                />
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-indigo-600" /> Select Time
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {timeSlots.map((slot) => {
                  const isAvailable = availableSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium text-center ${
                        selectedTime === slot
                          ? "bg-indigo-600 text-white"
                          : isAvailable
                          ? "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-indigo-800 flex items-center">
              <FaUserMd className="mr-2" />
              Patient Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="email@example.com"
                required
              />
            </div>

            {/* Insurance */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  id="has-insurance"
                  name="has-insurance"
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="has-insurance"
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  I have insurance
                </label>
              </div>

              {hasInsurance && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Insurance Provider Name"
                  />
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact (Optional)
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Name and Phone Number"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-indigo-800 flex items-center">
              <FaNotesMedical className="mr-2" />
              Reason for Visit
            </h2>

            {/* Summary */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="font-medium">Doctor:</span> Dr.{" "}
                  {doctor.fullName}
                </div>
                <div>
                  <span className="font-medium">Specialization:</span>{" "}
                  {doctor.specialist}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div>
                  <span className="font-medium">Time:</span> {selectedTime}
                </div>
                <div>
                  <span className="font-medium">Patient:</span> {patientName}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {appointmentType.charAt(0).toUpperCase() +
                    appointmentType.slice(1)}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">Fee:</span> ₹
                  {doctor.consultationFee}
                </p>
                <button
                  type="button"
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                  onClick={() => setStep(1)}
                >
                  Edit Details
                </button>
              </div>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Please describe your symptoms or reason for visit in detail to help the doctor prepare for your appointment."
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the terms and conditions
                </label>
                <p className="text-gray-500">
                  I understand that a cancellation fee may apply if I cancel
                  less than 24 hours before the appointment.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <div className="ml-2 text-sm font-medium">Schedule</div>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 2
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-2 text-sm font-medium">Information</div>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${
                    step >= 3 ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 3
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <div className="ml-2 text-sm font-medium">Confirmation</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-indigo-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold flex items-center">
                    <FaCalendarAlt className="mr-3" />
                    Book Appointment
                  </h1>

                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    <span className="font-medium">
                      Fee: ₹{doctor.consultationFee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="bg-indigo-50 px-8 py-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      doctor.profileImage || "https://via.placeholder.com/150"
                    }
                    alt={doctor.fullName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Dr. {doctor.fullName}
                    </h2>
                    <p className="text-indigo-700 font-medium">
                      {doctor.specialist}
                    </p>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <FaUserMd className="mr-1" />
                      <span>{doctor.experience} Years Experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <FaArrowLeft className="mr-2" /> Previous
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      <FaArrowLeft className="mr-2" /> Cancel
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="mr-2" /> Confirm Booking
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Additional Information */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Important Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>
                    Please arrive 15 minutes before your scheduled appointment
                    time.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>
                    Bring any previous medical records relevant to your
                    condition.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>
                    Cancellations must be made at least 24 hours in advance to
                    avoid fees.
                  </span>
                </li>
                <li className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                  <span>
                    For emergencies, please call our emergency line at
                    1800-XXX-XXXX.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;

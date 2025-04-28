import {
  ChevronDownIcon,
  MapPinIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useDetails } from "../context/detailsContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from "../context/adminContext";
import { Combobox } from "@headlessui/react";
import { motion } from "framer-motion";

// Qualification suggestions
const qualificationSuggestions = [
  "MBBS",
  "MD",
  "MS",
  "BDS",
  "MDS",
  "BAMS",
  "BHMS",
  "BUMS",
  "BPT",
  "MPT",
  "B.Sc Nursing",
  "M.Sc Nursing",
  "B.Pharm",
  "M.Pharm",
  "BMLT",
  "DMLT",
  "BBA Healthcare",
  "MBA Healthcare",
];

export default function MoreInfo() {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [qualificationQuery, setQualificationQuery] = useState("");

  const navigate = useNavigate();
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    handleUpdate,
  } = useDetails();
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialist, setspecialist] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user._id;
  const role = user.role;

  // Filtered qualification suggestions
  const filteredQualifications = qualificationSuggestions.filter((q) =>
    q.toLowerCase().includes(qualificationQuery.toLowerCase())
  );

  // Location search handler
  const handleLocationSearch = async (query) => {
    if (query.length < 3) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in,us,ca,gb&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      toast.error("Failed to fetch location suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "city" || name === "state") {
      handleLocationSearch(value);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setAddress((prev) => ({
      ...prev,
      city: location.address.city || location.address.town || "",
      state: location.address.state || "",
      country: location.address.country || prev.country,
      zip: location.address.postcode || "",
    }));
    setLocationSuggestions([]);
  };

  const navigateToDashboard = () => {
    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (role === "Doctor") {
      navigate("/doctor/dashboard");
    } else if (role === "Patient") {
      navigate("/patient/dashboard");
    } else if (role === "Receptionist") {
      navigate("/receptionist/dashboard");
    } else {
      navigate("/unauthorised");
    }
    toast.success("Welcome to your dashboard!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedData = {
        fullName,
        email,
        phone,
        role,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          zip: address.zip,
        },
        specialist,
        experience,
        qualification,
      };

      await handleUpdate(id, updatedData);
      toast.success("Profile updated successfully");
      navigateToDashboard();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigateToDashboard();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
    >
      <form
        className="p-6 m-4 bg-white rounded-xl shadow-lg w-full max-w-3xl space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please provide your details to get started
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={phone}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {(role === "Doctor" || role === "Receptionist") && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Experience in Years
                  </label>
                  <div className="mt-1">
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={experience}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(role === "Doctor" || role === "Receptionist") && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qualification
                  </label>
                  <div className="mt-1">
                    <Combobox value={qualification} onChange={setQualification}>
                      <div className="relative">
                        <Combobox.Input
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          onChange={(e) =>
                            setQualificationQuery(e.target.value)
                          }
                          displayValue={(q) => q}
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredQualifications.map((q) => (
                            <Combobox.Option
                              key={q}
                              value={q}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              <div className="flex items-center">
                                <AcademicCapIcon className="h-5 w-5 mr-2" />
                                <span>{q}</span>
                              </div>
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>
                    </Combobox>
                  </div>
                </div>
              )}

              {role === "Doctor" && (
                <div className="sm:col-span-3">
                  <label
                    htmlFor="specialist"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Specialisation
                  </label>
                  <div className="mt-1">
                    <select
                      id="specialist"
                      name="specialist"
                      value={specialist}
                      onChange={(e) => setspecialist(e.target.value)}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Specialisation</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street address
                </label>
                <div className="mt-1">
                  <input
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <div className="mt-1 relative">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {locationSuggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {locationSuggestions.map((location) => (
                        <li
                          key={location.place_id}
                          className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span>{location.display_name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State / Province
                </label>
                <div className="mt-1">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-1">
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    autoComplete="off"
                    value={address.zip}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900 hover:text-gray-700"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

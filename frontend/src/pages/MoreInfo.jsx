import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";
import { useDetails } from "../context/detailsContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from "../context/adminContext";
import { Country, State, City } from "country-state-city";

export default function MoreInfo() {
  const {badeg,setBadge} = useAdmin();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    stateCode: "",
    country: "India",
    countryCode: "IN",
    zip: "",
  });
  useEffect(() => {
    const stateList = State.getStatesOfCountry(address.countryCode);
    setStates(stateList);
    setAddress((prev) => ({ ...prev, state: "", city: "" }));
    setCities([]);
  }, [address.countryCode]);

  useEffect(() => {
    const cityList = City.getCitiesOfState(
      address.countryCode,
      address.stateCode
    );
    setCities(cityList);
  }, [address.stateCode]);

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
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigateToDashboard = () => {
    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else if (role === "Doctor") {
      navigate("/doctor/dashboard");
    } else if (role === "Patient") {
      navigate("/patient/dashboard");
    } else if (role === "Receptionist") {
      navigate("/receptionist/dashboard"); // Default dashboard
    } else {
      navigate("/unauthorised");
    }
    toast.success("Welcome to your dashboard! at moreinfo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    setBadge(true);
    navigateToDashboard();
  };

  const handleSkip = () => {
    navigateToDashboard();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8 px-2">
      <form
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-black p-8 border border-gray-100"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 border-b border-gray-200 pb-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Profile Information
          </h2>
          <p className="text-gray-500 text-sm">
            Fill in your details to complete your profile
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={phone}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {(role === "Doctor" || role === "Receptionist") && (
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience in Years
              </label>
              <input
                id="experience"
                name="experience"
                type="text"
                value={experience}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
          )}
          {(role === "Doctor" || role === "Receptionist") && (
            <div>
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Qualification
              </label>
              <input
                id="qualification"
                name="qualification"
                type="text"
                autoComplete="on bg-gray-400 text-black"
                value={qualification}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                onChange={(e) => setQualification(e.target.value)}
              />
            </div>
          )}
          {role === "Doctor" && (
            <div>
              <label
                htmlFor="specialist"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specialisation
              </label>
              <select
                id="specialist"
                name="specialist"
                value={specialist}
                onChange={(e) => setspecialist(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="">Select Specialisation</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
              </select>
            </div>
          )}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={address.countryCode}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.isoCode === e.target.value
                );
                setAddress((prev) => ({
                  ...prev,
                  country: country?.name || "",
                  countryCode: e.target.value,
                }));
              }}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              value={address.stateCode}
              onChange={(e) => {
                const state = states.find((s) => s.isoCode === e.target.value);
                setAddress((prev) => ({
                  ...prev,
                  state: state?.name || "",
                  stateCode: e.target.value,
                }));
              }}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <select
              id="city"
              name="city"
              value={address.city}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, city: e.target.value }))
              }
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ZIP / Postal code
            </label>
            <input
              id="zip"
              name="zip"
              type="text"
              autoComplete="off"
              value={address.zip}
              onChange={handleAddressChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"

            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="street"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Street address
            </label>
            <input
              id="street"
              name="street"
              type="text"
              autoComplete="off"
              value={address.street}
              onChange={handleAddressChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-x-4">
          <button
            type="button"
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

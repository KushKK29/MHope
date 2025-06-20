import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useAdmin } from "../context/adminContext";
import { useDoctor } from "../context/doctorContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const location = useLocation();
  const { user, setUser, handleSaveUser, admin } = useAdmin();
  const { doctor } = useDoctor();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (location.state?.isPatientProfile) {
          // Fetch patient data
          const response = await axios.get(
            `https://mhope.onrender.com/api/user/updateUser/${location.state.patientId}`
          );
          if (response.data) {
            setUser(response.data);
          }
        } else {
          // Use admin data
          setUser(admin);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [location.state, admin]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    experience: user?.experience || "",
    qualification: user?.qualification || "",
    specialist: user?.specialist || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      stateCode: user?.address?.stateCode || "",
      country: user?.address?.country || "India",
      countryCode: user?.address?.countryCode || "",
      zip: user?.address?.zip || "",
    },
  });

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);

    // Initialize user data
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        experience: user.experience || "",
        qualification: user.qualification || "",
        specialist: user.specialist || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          stateCode: user.address?.stateCode || "",
          country: user.address?.country || "India",
          countryCode: user.address?.countryCode || "",
          zip: user.address?.zip || "",
        },
      });
    }
  }, [user]);

  // Load states when country changes
  useEffect(() => {
    if (formData.address.countryCode) {
      const stateList = State.getStatesOfCountry(formData.address.countryCode);
      setStates(stateList);

      // Reset city when country changes
      if (
        !stateList.some((state) => state.isoCode === formData.address.stateCode)
      ) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            state: "",
            stateCode: "",
            city: "",
          },
        }));
        setCities([]);
      }
    }
  }, [formData.address.countryCode]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.address.countryCode && formData.address.stateCode) {
      const cityList = City.getCitiesOfState(
        formData.address.countryCode,
        formData.address.stateCode
      );
      setCities(cityList);

      // Reset city if current city isn't in the new list
      if (
        cityList.length > 0 &&
        !cityList.some((city) => city.name === formData.address.city)
      ) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            city: "",
          },
        }));
      }
    }
  }, [formData.address.stateCode, formData.address.countryCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    const country = countries.find((c) => c.isoCode === countryCode);

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        country: country?.name || "",
        countryCode,
        state: "",
        stateCode: "",
        city: "",
      },
    }));
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const state = states.find((s) => s.isoCode === stateCode);

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        state: state?.name || "",
        stateCode,
        city: "",
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    const updatedUserData = {
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      experience: formData.experience,
      qualification: formData.qualification,
      specialist: formData.specialist,
      address: {
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        stateCode: formData.address.stateCode,
        country: formData.address.country,
        countryCode: formData.address.countryCode,
        zip: formData.address.zip,
      },
    };

    try {
      const res = handleSaveUser(updatedUserData);
      if (res) {
        setUser(res);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const isDoctor = user?.role === "Doctor";
  const isStaff = user?.role === "Doctor" || user?.role === "Receptionist";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-sky-100 p-6">
      <div className="w-full max-w-2xl">
        <form
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <div className="border-b border-gray-800/10 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Profile
              </h2>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img
                  src={
                    user?.profileImage ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent address where you can receive mail.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Full Name */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base border-gray-300 border shadow-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 border-gray-300 border shadow-sm py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white border-gray-300 border shadow-sm px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Role display */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Role
                  </label>
                  <div className="mt-2">
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={user?.role || ""}
                      className="block w-full rounded-md bg-gray-100 border-gray-300 border shadow-sm px-3 py-1.5 text-base text-gray-900 sm:text-sm"
                      disabled
                    />
                  </div>
                </div>

                {/* Staff-specific fields */}
                {isStaff && (
                  <>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Experience in Years
                      </label>
                      <div className="mt-2">
                        <input
                          id="experience"
                          name="experience"
                          type="text"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="qualification"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Qualification
                      </label>
                      <div className="mt-2">
                        <input
                          id="qualification"
                          name="qualification"
                          type="text"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Doctor-specific fields */}
                {isDoctor && (
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="specialist"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Specialisation
                    </label>
                    <div className="mt-2">
                      <input
                        id="specialist"
                        name="specialist"
                        type="text"
                        value={formData.specialist}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Address Fields */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <div className="mt-2">
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.address.countryCode}
                      onChange={handleCountryChange}
                      className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-900"
                  >
                    State/Province
                  </label>
                  <div className="mt-2">
                    <select
                      id="stateCode"
                      name="stateCode"
                      value={formData.address.stateCode}
                      onChange={handleStateChange}
                      className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!formData.address.countryCode}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-900"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <select
                      id="city"
                      name="city"
                      value={formData.address.city}
                      onChange={handleAddressChange}
                      className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      disabled={!formData.address.stateCode}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-900"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      autoComplete="postal-code"
                      value={formData.address.zip}
                      onChange={handleAddressChange}
                      className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      id="street"
                      name="street"
                      type="text"
                      autoComplete="street-address"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      className="block w-full rounded-md border-gray-300 border shadow-sm bg-white px-3 py-1.5 text-base text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Joined Date */}
                {user?.updatedAt && (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="joinedAt"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Joined At
                    </label>
                    <div className="mt-2">
                      <input
                        id="joinedAt"
                        name="joinedAt"
                        type="text"
                        readOnly
                        value={new Date(user.updatedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                        className="block w-full rounded-md border-gray-300 border shadow-sm bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold text-gray-900"
              onClick={() => {
                // Reset form to initial user data
                if (user) {
                  setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    experience: user.experience || "",
                    qualification: user.qualification || "",
                    specialist: user.specialist || "",
                    address: {
                      street: user.address?.street || "",
                      city: user.address?.city || "",
                      state: user.address?.state || "",
                      stateCode: user.address?.stateCode || "",
                      country: user.address?.country || "India",
                      countryCode: user.address?.countryCode || "",
                      zip: user.address?.zip || "",
                    },
                  });
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

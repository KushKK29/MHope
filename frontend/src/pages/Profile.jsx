import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useAdmin } from "../context/adminContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser, handleSaveUser, admin } = useAdmin();

  // if (!user) {
  //   user = admin;
  // }
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "India",
    zip: user?.address?.zip || "",
  });

  const [experience, setExperience] = useState(user?.experience || "");
  const [qualification, setQualification] = useState(user?.qualification || "");
  const [specialist, setSpecialist] = useState(user?.specialist || "");

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUserData = {
      ...user,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
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

    handleSaveUser(updatedUserData);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-sky-100 p-6">
      <form
        className="p-4 m-4 border-2 border-gray-700 rounded-md shadow-2xl w-full max-w-3xl bg-white "
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="border-b border-gray-800/10 p-2">
            <h2 className="text-2xl font-bold md:text-xl text-gray-900 flex items-center justify-center">
              Profile
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Profile"
                className="w-full h-full object-cover"
              />
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
                    value={user?.fullName || ""}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base border-black border-[2px] text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                </div>
              </div>

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
                    autoComplete="off"
                    value={user?.email || ""}
                    className="block w-full rounded-md bg-white px-3 border-black border-[2px] py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>

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
                    type="text"
                    value={user?.phone || ""}
                    className="block w-full rounded-md bg-white border-black border-[2px] px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
              </div>

              {(user?.role === "Doctor" || user?.role === "Receptionist") && (
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
                      value={experience}
                      className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(user?.role === "Doctor" || user?.role === "Receptionist") && (
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
                      value={qualification}
                      className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      onChange={(e) => setQualification(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {user?.role === "Doctor" && (
                <div className="sm:col-span-3">
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
                      value={specialist}
                      className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                      onChange={(e) => setSpecialist(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="off"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="col-start-1 row-start-1 w-full border-black border-[2px] appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              <div className="col-span-full">
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
                    autoComplete="off"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-900"
                >
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="off"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
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
                    autoComplete="off"
                    value={address.zip}
                    onChange={handleAddressChange}
                    className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

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
                    value={
                      user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : ""
                    }
                    className="block w-full rounded-md border-black border-[2px] bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

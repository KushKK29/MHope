"use client";

import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  Dropdown,
  DropdownItem,
  Pagination,
} from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/adminContext";

// UserTable Component
const UserTable = ({ onEditClick, users, searchQuery }) => {
  const admin = useAdmin();
  const [filterRole, setFilterRole] = useState("All");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Filter by role and search query
  const filteredUsers = users
    .filter((user) => filterRole === "All" || user.role === filterRole)
    .filter(
      (user) =>
        searchQuery === "" ||
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-blue-600">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined At</th>
              <th className="px-6 py-3">
                <Dropdown label={`Filter: ${filterRole}`} inline color="light">
                  <DropdownItem onClick={() => setFilterRole("All")}>
                    All
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilterRole("Doctor")}>
                    Doctor
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilterRole("Patient")}>
                    Patient
                  </DropdownItem>
                  <DropdownItem onClick={() => setFilterRole("Receptionist")}>
                    Receptionist
                  </DropdownItem>
                </Dropdown>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:text-blue-500 cursor-pointer"
                    onClick={() => {
                      admin.setUser(user);
                      navigate("/profile");
                    }}
                  >
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }) ||
                      new Date(user.updatedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={() => onEditClick(user)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  {searchQuery
                    ? "No matching users found"
                    : "No users available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modern pagination component */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
            layout="pagination"
            className="bg-white rounded-lg shadow px-2 py-1"
          />
        </div>
      )}
    </div>
  );
};

// UserEditModal Component
const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
  const nameInputRef = useRef(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.fullName || "",
        email: user.email || "",
        role: user.role || "Patient",
        isActive: user.isActive !== false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSave(userData);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      show={isOpen}
      size="md"
      popup
      onClose={onClose}
      initialFocus={nameInputRef}
      className="rounded-lg shadow-lg"
    >
      <ModalHeader className="bg-gradient-to-r from-blue-700 to-sky-100" />
      <ModalBody className="bg-gradient-to-r from-blue-700 to-sky-100 rounded-b-lg">
        <div className="space-y-4">
          <h3 className="flex items-center justify-center text-xl font-medium text-white">
            Edit User Details
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name">Name</Label>
            </div>
            <TextInput
              id="name"
              ref={nameInputRef}
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Email</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="role">Role</Label>
            </div>
            <select
              id="role"
              className="bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={userData.role}
              onChange={handleChange}
            >
              <option value="Doctor">Doctor</option>
              <option value="Patient">Patient</option>
              <option value="Receptionist">Receptionist</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="isActive"
              checked={userData.isActive}
              onChange={handleChange}
              required
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>
          <div className="flex gap-4">
            <Button color="blue" className="w-full" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button color="gray" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

// Main ManageUsers Component
const ManageUsers = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    newToday: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const admin = useAdmin();
  const navigate = useNavigate();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || '{"role":""}')
      : { role: "" };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://mhope.onrender.com/api/user/getusers",
          {
            headers: { "Content-Type": "application/json" },
            params: { role: user?.role },
          }
        );

        if (res.data) {
          setUsers(res.data.users);

          // Calculate stats
          const activeUsers = res.data.users.filter((u) => u.isActive).length;
          const todayUsers = res.data.users.filter((u) => {
            const today = new Date();
            const joinedDate = new Date(u.joinedAt);
            return joinedDate.toDateString() === today.toDateString();
          }).length;

          setUserStats({
            total: res.data.users.length,
            active: activeUsers,
            newToday: todayUsers,
          });

          toast.success("Users fetched successfully");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Cannot fetch data");
      }
    };

    if (user?.role === "Admin") fetchUsers();
  }, [user?.role]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleSaveUser = async (updatedUserData) => {
    try {
      // Update user in backend
      await axios.put(
        `https://mhope.onrender.com/api/user/updateUser/${selectedUser._id}`,
        updatedUserData
      );

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === selectedUser._id ? { ...u, ...updatedUserData } : u
        )
      );

      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user", error.message);
    }
  };

  const handleAddUser = () => {
    setSelectedUser({
      fullName: "",
      email: "",
      role: "Patient",
      isActive: true,
    });
    setOpenModal(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Manage Users
            </h1>
            <Button color="success" onClick={handleAddUser}>
              Add New User
            </Button>
          </div>

          {/* User stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 border-blue-500">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-xl text-blue-500 font-bold">
                  {userStats.total}
                </p>
              </div>
              <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 border-green-500">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-xl text-green-500 font-bold">
                  {userStats.active}
                </p>
              </div>
              <div className="text-green-500 bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 border-yellow-500">
              <div>
                <p className="text-sm text-gray-500">New Today</p>
                <p className="text-xl text-yellow-500 font-bold">
                  {userStats.newToday}
                </p>
              </div>
              <div className="text-yellow-500 bg-yellow-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
              onChange={(e) => handleSearch(e.target.value)}
              value={searchQuery}
            />
          </div>

          {/* User Table Component */}
          <UserTable
            users={users}
            onEditClick={handleEditClick}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Edit User Modal */}
      <UserEditModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default ManageUsers;

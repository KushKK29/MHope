import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaUserCog, FaUserMd, FaUsers, FaFileAlt } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { CiViewTimeline } from "react-icons/ci";

const SidebarItem = ({ icon: Icon, label, link, isMobileView, isActive }) => (
  <Link to={link}>
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "hover:bg-blue-600/10 hover:text-blue-600"
        }
        ${isMobileView ? "justify-center" : ""}`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <h1 className="text-md font-bold">Control Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop fixed, Mobile conditional */}
      <div
        className={`${
          sidebarOpen ? "fixed inset-0 z-50 bg-slate-800" : "hidden"
        } md:block md:fixed md:inset-y-0 md:left-0 md:w-64 bg-slate-800 text-white transition-all duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex justify-center items-center h-16 text-xl font-semibold border-b border-slate-700">
            {!isMobileView && (
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
                Admin Panel
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            <SidebarItem
              icon={CgProfile}
              label="Dashboard"
              link="/doctor/dashboard"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/doctor/dashboard"}
            />
            {/* <SidebarItem
              icon={FaUserMd}
              label="Manage Doctors"
              link="/admin/manage_doctor"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/admin/manage_doctor"}
            /> */}
            <SidebarItem
              icon={FaUserCog}
              label="My Patients"
              link="/doctor/mypatients"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/doctor/mypatients"}
            />
            <SidebarItem
              icon={FaFileAlt}
              label="Prescriptions"
              link="/doctor/prescription"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/doctor/prescription"}
            />
            {/* <SidebarItem
              icon={CiViewTimeline}
              label="Create Appointment"
              link="/doctor/createAppointment"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/doctor/createAppointment"}
            /> */}
            {/* <SidebarItem
              icon={FaUsers}
              label="My Profile"
              link="/doctor/doctorProfile"
              isMobileView={isMobileView && sidebarOpen}
              isActive={location.pathname === "/doctor/doctorProfile"}
            /> */}
          </div>

          {/* Footer Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="text-sm text-slate-400 text-center">
              © 2025 Hospital Management By Kush Goel
            </div>
          </div>
        </div>
      </div>

      {/* Content Margin for Desktop */}
      <div className="md:ml-64" />
    </>
  );
};

export default Sidebar;

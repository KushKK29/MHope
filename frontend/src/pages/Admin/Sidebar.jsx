import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaUserCog, FaUserMd, FaUsers, FaFileAlt } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { CiViewTimeline } from "react-icons/ci";

const SidebarItem = ({ icon: Icon, label, link, isMobileView }) => (
  <Link to={link}>
    <div
      className={`flex items-center gap-3 p-3 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 cursor-pointer ${
        isMobileView ? "justify-center" : ""
      }`}
    >
      <Icon size={20} />
      {!isMobileView && <span className="text-sm font-medium">{label}</span>}
    </div>
  </Link>
);
const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  React.useEffect(() => {
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
    <div>
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center h-full">
        <h1 className="text-md font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop always visible, Mobile conditional */}
      <div
        className={`${
          sidebarOpen ? "block fixed inset-0 z-50 bg-slate-800/95" : "hidden"
        } md:block md:static md:z-auto md:w-64 md:min-h-screen bg-slate-800 text-white transition-all duration-300 overflow-x-auto resize-x`}
        style={{
          resize: "horizontal",
          overflow: "auto",
          minWidth: "200px",
          maxWidth: "100%",
        }}
      >
        {/* Close button for mobile sidebar */}
        {sidebarOpen && (
          <div className="md:hidden flex justify-end p-4">
            <button onClick={() => setSidebarOpen(false)}>
              <HiX size={24} />
            </button>
          </div>
        )}

        <div className="flex justify-center items-center h-16 text-xl font-semibold border-b border-gray-700">
          {!isMobileView && "Admin Panel"}
        </div>

        <div className="flex flex-col mt-6 px-2">
          <SidebarItem
            icon={CgProfile}
            label="Dashboard"
            link="/admin/dashboard"
            isMobileView={isMobileView && sidebarOpen}
          />
          <SidebarItem
            icon={FaUsers}
            label="Manage Users"
            link="/admin/manage_user"
            isMobileView={isMobileView && sidebarOpen}
          />
          <SidebarItem
            icon={FaUserMd}
            label="Manage Doctors"
            link="/admin/manage_doctor"
            isMobileView={isMobileView && sidebarOpen}
          />
          <SidebarItem
            icon={FaUserCog}
            label="Manage Patients"
            link="/admin/manage_patient"
            isMobileView={isMobileView && sidebarOpen}
          />
          <SidebarItem
            icon={CiViewTimeline}
            label="Manage Appointments"
            link="/admin/manage_appointments"
            isMobileView={isMobileView && sidebarOpen}
          />
          <SidebarItem
            icon={FaFileAlt}
            label="Reports"
            link="/admin/reports"
            isMobileView={isMobileView && sidebarOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Settings } from "lucide-react";
import { useDetails } from "../context/detailsContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);
  const { badge, setBadge, logout } = useDetails();

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(user);

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-extrabold text-blue-400 hover:text-white transition-colors tracking-wide drop-shadow-lg"
            >
              MHope
            </button>
          </div>

          {/* Search Bar (Commented Out) */}
          {/*
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search resources, guides, or support..."
              />
            </div>
          </div>
          */}

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative inline-block text-left" ref={menuRef}>
              <div className="indicator">
                {/* Notification badge if needed */}
                {!badge && (
                  <span className="indicator-item status status-success"></span>
                )}
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative inline-flex items-center justify-center rounded-full h-12 w-12 overflow-hidden border-2 border-blue-300 hover:border-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md bg-white"
                  id="user-menu"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  {userData?.profileImage ? (
                    <img
                      className="h-full w-full object-cover"
                      src={userData.profileImage}
                      alt={userData?.fullName || "User profile"}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
              </div>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  {/* User Info */}
                  <div
                    className="py-3 px-4 flex items-center gap-3 border-b border-gray-100"
                    role="none"
                  >
                    {userData?.profileImage ? (
                      <img
                        className="h-10 w-10 rounded-full border-2 border-blue-200"
                        src={userData.profileImage}
                        alt={userData?.fullName || "User profile"}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-lg border-2 border-blue-200">
                        {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-base">
                        {userData?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData?.email || "No email"}
                      </p>
                    </div>
                  </div>
                  {/* Menu Actions */}
                  <div className="py-1" role="none">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-blue-50 transition-colors font-medium gap-2"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <User className="h-5 w-5 text-blue-500" />
                      Profile
                    </button>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium gap-2"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

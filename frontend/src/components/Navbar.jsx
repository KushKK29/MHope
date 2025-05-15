import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, LogOut, Settings } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const menuRef = useRef(null);

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
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              MHope
            </button>
          </div>

          {/* Search Bar */}
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

          {/* User Menu */}
          <div className="flex items-center">
            <div className="relative inline-block text-left" ref={menuRef}>
              <div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 overflow-hidden border-2 border-blue-100 hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                      {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
              </div>

              {isMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="py-1" role="none">
                    <div className="flex items-center px-4 py-2 text-sm text-gray-700">
                      {userData?.profileImage ? (
                        <img
                          className="h-8 w-8 rounded-full mr-2"
                          src={userData.profileImage}
                          alt={userData?.fullName || "User profile"}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full mr-2 flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                          {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {userData?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userData?.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/settings");
                      }}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
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

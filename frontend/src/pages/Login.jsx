import React, { useState } from "react";
import i1 from "../assets/i1.jpeg";
import i3 from "../assets/i3.jpeg";
import i4 from "../assets/i4.png";
import i5 from "../assets/i5.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDetails } from "../context/detailsContext";
import { useMemo } from "react";
const Login = () => {
  const {
    see,
    setSee,
    login,
    setLogin,
    fullName,
    email,
    password,
    role,
    setFullName,
    setPassword,
    setEmail,
    setRole,
    handelLoginSignup,
  } = useDetails();

  const onSubmit = (e) => {
    e.preventDefault();
    handelLoginSignup();
  };
  const images = [i4, i1, i1, i5, i4, i5];
  const randomImage = useMemo(() => {
    return images[Math.floor(Math.random() * images.length)];
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200 px-4 text-black">
      <div className="bg-white rounded-2xl shadow-2xl shadow-base-100   flex flex-col md:flex-row overflow-hidden max-w-2xl w-2/3 h-auto md:min-h-1/2">
        <div className="hidden md:block md:w-1/2  items-center justify-center">
          <img
            src={randomImage}
            alt="login"
            className="w-full h-full object-cover  border-black"
          />
        </div>

        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold font-serif font-stretch-75% mb-6 text-center">
            {login ? "Create an account" : "Login to your account"}
          </h2>

          <form className="flex flex-col gap-2" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-serif font-stretch-75% font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full bg-blue-200 hover:border-2 hover:border-blue-300"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            {login ? (
              <div>
                <label className="block text-sm font-serif font-stretch-75% font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="input input-bordered w-full bg-blue-200 hover:border-2 hover:border-blue-300"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                />
              </div>
            ) : (
              <></>
            )}

            {/* Role Dropdown */}
            {login ? (
              <div>
                <label className="block text-sm font-medium font-serif font-stretch-75%">
                  Role
                </label>
                <select
                  className="input input-bordered w-full bg-blue-200 hover:border-2 hover:border-blue-300"
                  defaultValue=""
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                  {/* <option value="Receptionist">Receptionist</option> */}
                </select>
              </div>
            ) : (
              <></>
            )}

            <div className="relative">
              <label className="block text-sm font-medium font-serif font-stretch-75%">
                Password
              </label>
              <input
                type={see ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full bg-blue-200 hover:border-2 hover:border-blue-300"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span
                onClick={() => {
                  setSee(!see);
                }}
                className="absolute right-3 mt-2 z-10 cursor-pointer text-xl"
              >
                {see ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-neutral w-full mt-4 font-serif font-stretch-75%"
            >
              {login ? "Sign Up" : "Login"}
            </button>
            <p className="font-serif font-stretch-75%">
              {login ? "Have an account " : "Don't have an account "}{" "}
              <span
                className="underline text-blue-500 cursor-pointer"
                onClick={() => setLogin(!login)}
              >
                {login ? "Login" : "Sign Up"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

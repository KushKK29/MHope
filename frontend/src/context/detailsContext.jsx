import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const detailsContext = createContext(null);

export const useDetails = () => {
  return useContext(detailsContext);
};

export const DetailsProvider = ({ children }) => {
  const [see, setSee] = useState(false);
  const [badge, setBadge] = useState(false);
  const [login, setLogin] = useState(false);
  const [isloggedIn, setIsloggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState({ "": "" }); // Initialize details with an empty object

  // Initialize authentication state from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData._id) {
          setIsloggedIn(true);
          setLogin(true);
          console.log("User authenticated from localStorage:", userData);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handelLoginSignup = () => {
    if (!login) {
      axios
        .post("https://mhope.onrender.com/api/user/login", { email, password })
        .then((res) => {
          if (res.data) {
            toast.success("Login successful");
            setLogin(true);
            setIsloggedIn(true);  // Set isloggedIn to true on successful login
            localStorage.setItem("user", JSON.stringify(res.data.user));
            if (res.data.user.role === "Admin") {
              navigate("/admin/dashboard");
            } else if (res.data.user.role === "Doctor") {
              navigate("/doctor/dashboard");
            } else if (res.data.user.role === "Patient") {
              navigate("/patient/dashboard");
            } else if (res.data.user.role === "Receptionist") {
              navigate("/receptionist/dashboard");
            } else {
              navigate("/unauthorized");
            }
          }
        })
        .catch((err) => {
          toast.error(
            "Login failed: " + err.response?.data?.message || err.message
          );
        });
    } else {
      axios
        .post("https://mhope.onrender.com/api/user/signup", {
          fullName,
          email,
          password,
          role,
        })
        .then((res) => {
          const user = res.data.user;

          if (user) {
            toast.success("Signup successful");
            setLogin(true);
            setIsloggedIn(true);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "Admin") {
              navigate("/admin/dashboard");
            } else if (user.role === "Doctor") {
              navigate("/moreinfo");
              // navigate("/doctor/dashboard");
            } else if (user.role === "Patient") {
              navigate("/moreinfo");
              // navigate("/patient/dashboard");
            } else if (user.role === "Receptionist") {
              navigate("/moreinfo");
              // navigate("/receptionist/dashboard");
            } else {
              navigate("/unauthorized");
            }
          } else {
            toast.error("Signup failed: No user returned at context");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            "Sign up failed: at context " +
              (err.response?.data?.message || err.message)
          );
        });
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `https://mhope.onrender.com/api/user/updateUser/${id}`,
        updatedData
      );

      if (response.success) {
        toast.success("successully Updated");
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(updatedData));
        return updatedData;
      }
      return null;
    } catch (error) {
      console.error(error);
      toast.error(
        "Error updating user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Logout function
  const logout = () => {
    setIsloggedIn(false);
    setLogin(false);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <detailsContext.Provider
      value={{
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
        details,
        setDetails,
        phone,
        setPhone,
        handleUpdate,
        badge,
        setBadge,
        isloggedIn,
        setIsloggedIn,
        logout,
      }}
    >
      {children}
    </detailsContext.Provider>
  );
};

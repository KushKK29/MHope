import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
export const detailsContext = createContext(null);

export const useDetails = () => {
  return useContext(detailsContext);
};

export const DetailsProvider = ({ children }) => {
  const [see, setSee] = useState(false);
  const [login, setLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState({ "": "" }); // Initialize details with an empty object

  const handelLoginSignup = () => {
    if (!login) {
      axios
        .post("http://localhost:4000/api/user/login", { email, password })
        .then((res) => {
          if (res.data) {
            toast.success("Login successful");
            setLogin(true);
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
              navigate("/unauthorised");
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
        .post("http://localhost:4000/api/user/signup", {
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
              navigate("/unauthorised");
            }
          } else {
            toast.error("Signup failed: No user returned at context");
          }
        })
        .catch((err) => {
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
        `http://localhost:4000/api/user/updateUser/${id}`,
        updatedData
      );

      console.log(response.data);
      toast.success("User updated successfully");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(
        "Error updating user: " + (error.response?.data?.message || error.message)
      );
    }
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
      }}
    >
      {children}
    </detailsContext.Provider>
  );
};

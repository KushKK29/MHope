// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAdmin } from "../src/context/adminContext";
import { useDetails } from "../src/context/detailsContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin } = useAdmin();
  const { isloggedIn } = useDetails();

  // Get user from localStorage as fallback
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = admin?.role ? admin : userFromStorage;

  console.log("ProtectedRoute Debug:", {
    isloggedIn,
    currentUser,
    allowedRoles,
    userRole: currentUser?.role,
  });

  // Check if user is logged in
  if (!isloggedIn && !currentUser?._id) {
    console.log("User not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(currentUser?.role)) {
    console.log(
      "User role not allowed:",
      currentUser?.role,
      "Allowed:",
      allowedRoles
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

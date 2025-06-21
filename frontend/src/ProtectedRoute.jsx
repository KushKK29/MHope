// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAdmin } from "../src/context/adminContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin } = useAdmin();
  console.log(admin);
  if (!admin) return <Navigate to="/login" />;
  if (!allowedRoles.includes(admin.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;

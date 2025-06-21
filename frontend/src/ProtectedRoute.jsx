// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAdmin } from "../src/context/adminContext";
import {useDetails} from "../src/context/detailsContext"
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { admin } = useAdmin();
  const {isloggedIn}=useDetails();
  console.log(admin);
  if (!isloggedIn) return <Navigate to="/login" />;
  if (!allowedRoles.includes(admin.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;

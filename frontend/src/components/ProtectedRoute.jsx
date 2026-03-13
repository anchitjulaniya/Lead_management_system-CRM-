import { Navigate } from "react-router-dom";
import {isTokenExpired} from "../utils/auth";

const ProtectedRoute = ({ children }) => {

  const token = sessionStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
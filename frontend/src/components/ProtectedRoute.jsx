import { Navigate } from "react-router-dom";
import {isTokenExpired} from "../utils/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

  const token = sessionStorage.getItem("token");
  const user = useContext(AuthContext);

  if (!token || isTokenExpired(token) || !user) {
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
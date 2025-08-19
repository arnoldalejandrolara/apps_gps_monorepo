// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = Cookies.get("token");

  if (isAuthenticated || token) {
    return children;
  }

  return <Navigate to="/login" />;
}
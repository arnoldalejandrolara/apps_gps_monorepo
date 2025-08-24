import { Navigate } from "react-router-dom";
import { useAuth } from "../context";

export function ProtectedRoute({ children }) {
    const { user } = useAuth();

    return user ? children : <Navigate to="/" />;
}
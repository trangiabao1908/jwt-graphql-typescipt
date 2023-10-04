import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../contexts/AuthProvider";
import authToken from "../utils/authToken";
const ProtectedRoute = () => {
  const { isAuthenticated } = useContext<AuthContextType>(AuthContext);
  const token = authToken.getToken();

  if (!isAuthenticated && !token) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

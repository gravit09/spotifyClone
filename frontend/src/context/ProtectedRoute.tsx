import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/",
  children,
}) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(!token); // Avoid loading if no token is available
  }, []);

  console.log("Auth state:", isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

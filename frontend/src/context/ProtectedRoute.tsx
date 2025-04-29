import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  redirectPath = "/login",
  children,
}: ProtectedRouteProps) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

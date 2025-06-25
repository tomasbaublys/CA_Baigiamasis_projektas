import { useContext } from "react";
import { Navigate } from "react-router";
import UsersContext from "../contexts/UsersContext";
import { UsersContextTypes } from "../../types";
import type { ReactElement } from "react";

type ProtectedRouteProps = {
  children: ReactElement;
  reason?: string; // Not used anymore since we’re redirecting
};

const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

  if (loggedInUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
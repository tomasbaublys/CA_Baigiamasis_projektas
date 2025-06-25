import { useContext } from "react";
import { Navigate } from "react-router";
import type { ReactElement } from "react";
import UsersContext from "../contexts/UsersContext";
import { UsersContextTypes } from "../../types";

type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
import { useAppSelector } from "@/app/redux";
import { AUTH_PATH } from "@/components/constants/paths";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import { Navigate, useLocation } from "react-router";
import type { FC, ReactNode } from "react";

interface ProtectedRoutes {
  children: ReactNode;
}

export const PrivateRoute: FC<ProtectedRoutes> = ({ children }) => {
  const isAuthorization = useAppSelector(authSlice.selectors.selectIsAuthorization);
  const location = useLocation();
  
  if (!isAuthorization) {
    return <Navigate to={`${AUTH_PATH}?mode=login`} state={{ from: location }} replace/>;
  } else {
    return children;
  }
};

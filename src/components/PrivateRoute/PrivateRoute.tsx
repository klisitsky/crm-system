import { useAppSelector } from "@/app/redux";
import { AUTH_PATH } from "@/components/constants/paths";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import { Navigate, useLocation } from "react-router";
import type { FC, ReactNode } from "react";

interface ProtectedRoutes {
  children: ReactNode;
}

export const PrivateRoute: FC<ProtectedRoutes> = ({ children }) => {
  const accessToken = useAppSelector(authSlice.selectors.selectAccessToken);
  const location = useLocation();
  
  if (!accessToken) {
    return <Navigate to={`${AUTH_PATH}?mode=login`} state={{ from: location }} replace/>;
  } else {
    return children;
  }
};

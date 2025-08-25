import { Navigate } from "react-router";
import { useAppSelector } from "@/app/redux";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import type { FC, ReactNode } from "react";

interface ProtectedRoutes {
  children: ReactNode;
}

export const PrivateRoute: FC<ProtectedRoutes> = ({ children }) => {
  const accessToken = useAppSelector(authSlice.selectors.selectAccessToken);

  if (!accessToken) {
    return <Navigate to={"/auth"} />;
  } else {
    return children;
  }
};
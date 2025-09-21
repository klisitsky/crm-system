import { useAppSelector } from "../../store/redux";
import { AUTH_PATH } from "@/components/constants/paths";
import { Navigate, useLocation } from "react-router";
import { selectAuthRequestData } from "@/store/selectors.ts/authSelectors";
import type { FC, ReactNode } from "react";

interface ProtectedRoutes {
  children: ReactNode;
}

export const PrivateRoute: FC<ProtectedRoutes> = ({ children }) => {
  const { data } = useAppSelector(selectAuthRequestData);
  const location = useLocation();

  if (!data?.isAuthorization) {
    return <Navigate to={`${AUTH_PATH}?mode=login`} state={{ from: location }} replace />;
  } else {
    return children;
  }
};

import { AUTH_PATH, LOGIN_PATH } from "@/components/constants/paths";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";

export const AppProtectedRoutes = () => {
  const { data } = useAppSelector(selectAuthRequestData);
  const location = useLocation();

  if (!data?.isAuthorization) {
    return <Navigate to={`${AUTH_PATH}/${LOGIN_PATH}`} state={{ from: location }} replace />;
  } else {
    return <Outlet />
  }
};

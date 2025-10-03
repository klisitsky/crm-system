import { AUTH_PATH, LOGIN_PATH } from "@/components/constants/paths";
import { useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { Navigate, Outlet, useLocation } from "react-router";

export const AppProtectedRoutes = () => {
  const location = useLocation();
  const { data: authData } = useAppSelector(selectAuthRequestData);

  if (authData?.isAuthorization) {
    return <Outlet />;
  } else {
    return <Navigate to={`${AUTH_PATH}/${LOGIN_PATH}`} state={{ from: location }} replace />;
  }
};

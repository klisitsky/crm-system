import { getPathFrom } from "@/utils/getPathFrom";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../redux";
import { selectAuthRequestData } from "../../selectors.ts/authSelectors";

export const AuthRoutes = () => {
  const location = useLocation();

  const { data } = useAppSelector(selectAuthRequestData);

  if (data?.isAuthorization) {
    return <Navigate to={getPathFrom(location)} replace />;
  }

  return <Outlet/>;
};

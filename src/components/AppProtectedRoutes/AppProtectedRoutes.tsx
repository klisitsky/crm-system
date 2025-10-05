import { AUTH_PATH, LOGIN_PATH } from "@/components/constants/paths";
import { useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "@/components/Spinner/Spinner";
import { REFRESH_TOKEN } from "../constants/localStorageValues";

export const AppProtectedRoutes = () => {
  const { data: authData, status } = useAppSelector(selectAuthRequestData);

  const hasRefresh = !!localStorage.getItem(REFRESH_TOKEN);
  const isLoadingAuth = status.isPending || (status.isIdle && hasRefresh);

  if (isLoadingAuth) {
    return <Spinner />;
  }

  if (authData?.isAuthorization) {
    return <Outlet />;
  }

  return <Navigate to={`${AUTH_PATH}/${LOGIN_PATH}`} replace />;
};

import { useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "../Spinner/Spinner";
import { TODOS_PATH } from "../constants/paths";

export const AuthRoutes = () => {
  const { data, status } = useAppSelector(selectAuthRequestData);

  if (status.isPending) {
    return <Spinner />;
  }

  return data?.isAuthorization ? <Navigate to={TODOS_PATH} replace /> : <Outlet />;
};

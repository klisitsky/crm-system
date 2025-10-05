import { ForbiddenPage } from "@/pages/ForbiddenPage/ForbiddenPage";
import { useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { isAdminOrModeratorRole } from "@/utils/isAdminOrModeratorRole";
import { Outlet } from "react-router-dom";
import { Spinner } from "../Spinner/Spinner";

export const UserRightsProtectedRoutes = () => {
  const { data, status } = useAppSelector(selectProfileRequestData);

  if (status.isPending) {
    return <Spinner />;
  }

  if (isAdminOrModeratorRole(data?.roles)) {
    return <Outlet />;
  } else {
    return <ForbiddenPage />;
  }
};

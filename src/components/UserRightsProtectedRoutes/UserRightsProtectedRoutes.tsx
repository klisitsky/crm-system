import { ForbiddenPage } from "@/pages/ForbiddenPage/ForbiddenPage";
import { useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { isAdminOrModeratorRole } from "@/utils/isAdminOrModeratorRole";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import Flex from "antd/es/flex";
import Spin from "antd/es/spin";
import { Outlet } from "react-router-dom";

export const UserRightsProtectedRoutes = () => {
  const { data, status } = useAppSelector(selectProfileRequestData);

  if (status.isPending) {
    return (
      <Flex justify="center">
        <Spin size="large" indicator={<LoadingOutlined spin />} />
      </Flex>
    );
  }

  if (isAdminOrModeratorRole(data?.roles)) {
    return <Outlet />;
  } else {
    return <ForbiddenPage />;
  }
};

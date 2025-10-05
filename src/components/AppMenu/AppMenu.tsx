import Menu from "antd/es/menu/menu";
import { useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { useLocation } from "react-router";
import { getMenuItems } from "@/components/AppMenu/helpers/getMenuItems";

export const AppMenu = () => {
  const location = useLocation();
  const { data } = useAppSelector(selectProfileRequestData);

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={getMenuItems(data?.roles)}
      selectedKeys={[location.pathname]}
    />
  );
};

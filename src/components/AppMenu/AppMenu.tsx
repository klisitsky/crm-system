import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import Menu from "antd/es/menu/menu";
import { NavLink, useLocation } from "react-router";
import { PROFILE_PATH, TODOS_PATH } from "@/components/constants/paths";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export const AppMenu = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: TODOS_PATH,
      icon: <UnorderedListOutlined />,
      label: <NavLink to={TODOS_PATH}>Список задач</NavLink>,
    },
    {
      key: PROFILE_PATH,
      icon: <UserOutlined />,
      label: <NavLink to={PROFILE_PATH}>Профиль</NavLink>,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={menuItems}
      selectedKeys={[location.pathname]}
    />
  );
};

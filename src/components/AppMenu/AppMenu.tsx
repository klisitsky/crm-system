import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import type { MenuProps } from "antd";
import Menu from "antd/es/menu/menu";
import { NavLink, useLocation } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

export const AppMenu = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: "/todos",
      icon: <UnorderedListOutlined />,
      label: <NavLink to="/todos">Список задач</NavLink>,
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: <NavLink to="/profile">Профиль</NavLink>,
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

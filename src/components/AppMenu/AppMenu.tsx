import ProfileOutlined from "@ant-design/icons/lib/icons/ProfileOutlined";
import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UsergroupAddOutlined from "@ant-design/icons/lib/icons/UsergroupAddOutlined";
import { PROFILE_PATH, TODOS_PATH, USERS_PATH } from "@/components/constants/paths";
import Menu from "antd/es/menu/menu";
import { NavLink, useLocation } from "react-router";
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
      icon: <ProfileOutlined />,
      label: <NavLink to={PROFILE_PATH}>Профиль</NavLink>,
    },
    {
      key: USERS_PATH,
      icon: <UsergroupAddOutlined />,
      label: <NavLink to={USERS_PATH}>Пользователи</NavLink>,
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

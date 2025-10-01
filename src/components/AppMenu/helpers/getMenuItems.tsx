import ProfileOutlined from "@ant-design/icons/lib/icons/ProfileOutlined";
import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UsergroupAddOutlined from "@ant-design/icons/lib/icons/UsergroupAddOutlined";
import { NavLink } from "react-router-dom";
import { isAdminOrModeratorRole } from "@/utils/isAdminOrModeratorRole";
import { PROFILE_PATH, TODOS_PATH, USERS_PATH } from "@components/constants/paths";
import type { MenuProps } from "antd";
import type { Role } from "@/types/profile";

export type MenuItem = Required<MenuProps>["items"][number];

export const getMenuItems = (roles: Role[] | undefined) => {
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
  ];

  if (isAdminOrModeratorRole(roles)) {
    menuItems.push({
      key: USERS_PATH,
      icon: <UsergroupAddOutlined />,
      label: <NavLink to={USERS_PATH}>Пользователи</NavLink>,
    });
  }
  
  return menuItems;
};

import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import type { MenuProps } from "antd";
import Menu from "antd/es/menu/menu";
import { useState } from "react";
import { NavLink } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

export const AppMenu = () => {
  const [current, setCurrent] = useState("tasks");

  const handleMenuClick: MenuProps["onClick"] = (event) => {
    setCurrent(event.key);
  };

  const menuItems: MenuItem[] = [
    {
      key: "tasks",
      icon: <UnorderedListOutlined />,
      label: <NavLink to="/tasks">Список задач</NavLink>,
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <NavLink to="/profile">Профиль</NavLink>,
    },
  ];

  return (
    <Menu
      theme="dark"
      onClick={handleMenuClick}
      mode="inline"
      items={menuItems}
      selectedKeys={[current]}
    />
  );
};

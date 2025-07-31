import UnorderedListOutlined from "@ant-design/icons/lib/icons/UnorderedListOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import Menu from "antd/es/menu/menu";
import { useState } from "react";
import { NavLink } from "react-router";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

export const AppMenu = () => {
  const [current, setCurrent] = useState("todos");

  const handleMenuClick: MenuProps["onClick"] = (event) => {
    setCurrent(event.key);
  };

  const menuItems: MenuItem[] = [
    {
      key: "todos",
      icon: <UnorderedListOutlined />,
      label: <NavLink to="/todos">Список задач</NavLink>,
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

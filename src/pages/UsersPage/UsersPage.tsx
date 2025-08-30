import { useAppDispatch, useAppSelector } from "@/app/redux";
import { formatDate } from "@/utils/formatDate";
import { Card, Table, Tag, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { fetchUsers, usersSlice } from "./usersSlice";
import type { User } from "@/types/users";
import type { TableProps } from "antd";

interface UserWithKey extends User {
  key: React.Key;
}
type ColumnTypes = Exclude<TableProps<UserWithKey>["columns"], undefined>;

const onChange: TableProps<UserWithKey>["onChange"] = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(usersSlice.selectors.selectUsersDataWithKey);
  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: "Имя",
      dataIndex: "username",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Почта",
      dataIndex: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Дата",
      dataIndex: "date",
      width: 100,
    },
    {
      title: "Cтатус блокировки",
      dataIndex: "isBlocked",
      width: 150,
      render: (_, { isBlocked }) => (
        <Tag color={isBlocked ? "volcano" : "green"}>
          {isBlocked ? "Заблокирован" : "Не заблокирован"}
        </Tag>
      ),
    },
    {
      title: "Роли",
      dataIndex: "roles",
      render: (_, { roles }) => (
        <>
          {roles.map((role) => {
            const roleColors = {
              ADMIN: "volcano",
              MODERATOR: "purple",
              USER: "green",
            };
            return (
              <Tag color={roleColors[role]} key={role}>
                {role}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Телефон",
      dataIndex: "phoneNumber",
      width: 150,
      ellipsis: true,
    },
  ];
  
  const usersDataWithKey = useMemo(() => {
    return usersData.map((user) => {
      user.date = formatDate(user.date);
      return { ...user, key: user.id };
    });
  }, [usersData]);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  return (
    <Card>
      <Typography.Title level={2}>Управление пользователями</Typography.Title>
      <Table<UserWithKey>
        columns={columns}
        dataSource={usersDataWithKey}
        onChange={onChange}
        showSorterTooltip={{ target: "sorter-icon" }}
        size="small"
        pagination={{ current: 1, defaultPageSize: 20 }}
      />
    </Card>
  );
};


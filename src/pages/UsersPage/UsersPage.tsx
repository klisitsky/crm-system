import { useAppDispatch, useAppSelector } from "@/app/redux";
import type { Roles, User } from "@/types/users";
import { formatDate } from "@/utils/formatDate";
import { CheckOutlined, CloseOutlined, DeleteFilled, UserOutlined } from "@ant-design/icons";
import type { CheckboxOptionType, TableProps } from "antd";
import { Button, Card, Checkbox, Flex, Space, Switch, Table, Tag, Typography } from "antd";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  deleteUser,
  fetchUsers,
  updateUserIsBlockedStatus,
  updateUserRights,
  usersSlice,
} from "./usersSlice";

interface UserWithKey extends User {
  key: React.Key;
}
type ColumnTypes = Exclude<TableProps<UserWithKey>["columns"], undefined>;

interface CustomizeCellComponents {
  EditForm: (props: CellProps) => ReactNode;
  ViewCell: (props: CellProps) => ReactNode;
}

type ExtraColumnPropsMap = Record<string, CustomizeCellComponents>;

interface CellProps {
  record: User;
  toggleEditMode: () => void;
}

interface EditableCellProps extends CustomizeCellComponents {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof UserWithKey;
  record: UserWithKey;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  EditForm,
  ViewCell,
  ...restProps
}) => {
  const [editMode, setEditMode] = useState(false);
  let childNode = children;

  if (editable && record) {
    const { key, ...restRecordProps } = record;

    childNode = editMode ? (
      <EditForm key={key} toggleEditMode={() => setEditMode(false)} record={restRecordProps} />
    ) : (
      <ViewCell key={key} toggleEditMode={() => setEditMode(true)} record={restRecordProps} />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const isAdmin = (record: User): boolean => {
  return record.id === 1 || record.id === 2;
};

export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(usersSlice.selectors.selectUsersDataWithKey);

  const usersDataWithKey = useMemo(() => {
    return usersData.map((user) => {
      user.date = formatDate(user.date);
      return { ...user, key: user.id };
    });
  }, [usersData]);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
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
      width: 170,
      editable: true,
    },
    {
      title: "Роли",
      dataIndex: "roles",
      width: 300,
      editable: true,
    },
    {
      title: "Телефон",
      dataIndex: "phoneNumber",
      width: 150,
      ellipsis: true,
    },
    {
      title: "",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Space>
            <Button type="link" icon={<UserOutlined key="user" />}>
              Перейти к профилю
            </Button>
            {!isAdmin(record) && (
              <Button
                type="link"
                icon={<DeleteFilled key="delete" />}
                onClick={() => handleDeleteUser(record.id)}
              />
            )}
          </Space>
        );
      },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    const extraColumnPropsMap: ExtraColumnPropsMap = {
      roles: {
        EditForm: RolesEditForm,
        ViewCell: RolesViewCell,
      },
      isBlocked: {
        EditForm: IsBlockedEditForm,
        ViewCell: IsBlockedViewCell,
      },
    };

    return {
      ...col,
      onCell: (record: UserWithKey) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        EditForm: extraColumnPropsMap[col.dataIndex].EditForm,
        ViewCell: extraColumnPropsMap[col.dataIndex].ViewCell,
      }),
    };
  });

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  return (
    <Card>
      <Typography.Title level={2}>Управление пользователями</Typography.Title>
      <Table<UserWithKey>
        columns={columns as ColumnTypes}
        bordered
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={usersDataWithKey}
        showSorterTooltip={{ target: "sorter-icon" }}
        size="small"
        pagination={{ current: 1, defaultPageSize: 20 }}
      />
    </Card>
  );
};

const RolesViewCell = ({ record, toggleEditMode }: CellProps) => {
  const startEdit = () => {
    if (!isAdmin(record)) {
      toggleEditMode();
    }
  };

  return (
    <Button type="text" onClick={startEdit} style={{ height: "max-content", padding: "5px" }}>
      <Flex gap="small" wrap>
        {record.roles.map((role) => {
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
      </Flex>
    </Button>
  );
};

const IsBlockedViewCell = ({ record, toggleEditMode }: CellProps) => {
  const startEdit = () => {
    if (!isAdmin(record)) {
      toggleEditMode();
    }
  };

  return (
    <Button type="text" onClick={startEdit}>
      <Tag color={record.isBlocked ? "volcano" : "green"}>
        {record.isBlocked ? "Заблокирован" : "Не заблокирован"}
      </Tag>
    </Button>
  );
};

const RolesEditForm = ({ record, toggleEditMode }: CellProps) => {
  const dispatch = useAppDispatch();
  const [roles, setRoles] = useState<string[]>(record.roles);
  const isPending = useAppSelector(usersSlice.selectors.updateUserRightsPending);

  const rolesOptions: CheckboxOptionType<string>[] = [
    { label: "USER", value: "USER" },
    { label: "MODERATOR", value: "MODERATOR" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  const handleUpdateUserRights = async () => {
    await dispatch(updateUserRights({ id: record.id, params: { roles: roles as Roles[] } }));
    toggleEditMode();
  };

  return (
    <Flex align="center" justify="space-around">
      <Checkbox.Group
        options={rolesOptions}
        value={roles}
        disabled={isPending}
        onChange={(roles: string[]) => {
          setRoles(roles);
        }}
      />
      <Flex gap="small">
        <Button
          size="small"
          variant="solid"
          color="blue"
          icon={<CheckOutlined />}
          disabled={roles.length === 0 || isPending}
          onClick={handleUpdateUserRights}
        />
        <Button
          size="small"
          variant="outlined" 
          color="blue"
          icon={<CloseOutlined />}
          disabled={roles.length === 0 || isPending}
          onClick={toggleEditMode}
        />
      </Flex>
    </Flex>
  );
};

const IsBlockedEditForm = ({ toggleEditMode, record }: CellProps) => {
  const dispatch = useAppDispatch();
  const [isBlockedStatus, setIsBlockedStatus] = useState(record.isBlocked);
  const isPending = useAppSelector(usersSlice.selectors.updateUserIsBlockedStatusPending);

  const handleUpdateIsBlockedStatus = () => {
    dispatch(updateUserIsBlockedStatus({ id: record.id, isBlocked: isBlockedStatus }));
    toggleEditMode();
  };

  return (
    <Flex align="center" justify="space-around">
      <Switch
        checked={isBlockedStatus}
        onChange={() => setIsBlockedStatus((prev) => !prev)}
        disabled={isPending}
      />
      <Flex gap="small">
        <Button
          size="small"
          variant="solid"
          color="blue"
          icon={<CheckOutlined />}
          onClick={handleUpdateIsBlockedStatus}
          disabled={isPending}
        />
        <Button
          size="small"
          variant="outlined"
          color="blue"
          icon={<CloseOutlined />}
          onClick={toggleEditMode}
          disabled={isPending}
        />
      </Flex>
    </Flex>
  );
};

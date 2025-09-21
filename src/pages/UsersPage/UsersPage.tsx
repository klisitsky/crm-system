import { formatDate } from "@/utils/formatDate";
import { CheckOutlined, CloseOutlined, DeleteFilled, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Flex,
  notification,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usersApi } from "@/api/usersApi";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { Roles, User, UsersMetaInfo } from "@/types/users";
import type { CheckboxOptionType, TableProps } from "antd";
import type { ReactNode } from "react";
import type { LoadingStatus } from "@/types/common";

interface UserWithKey extends User {
  key: React.Key;
}

type ColumnTypes = Exclude<TableProps<UserWithKey>["columns"], undefined>;

interface CustomizeCellComponents {
  ViewCell: (props: CellProps) => ReactNode;
  EditorCell: (props: EditorCellProps) => ReactNode;
}

type ExtraColumnPropsMap = Record<string, CustomizeCellComponents>;

interface CellProps {
  record: User;
  toggleEditMode: () => void;
}

interface EditorCellProps extends CellProps {
  isLoading?: boolean;
  onUpdate?: () => void;
}

interface EditableCellProps extends CustomizeCellComponents {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof UserWithKey;
  record: UserWithKey;
  isLoading: boolean;
  onUpdate: () => void;
}

const isAdmin = (record: User): boolean => {
  return record.id === 1 || record.id === 2;
};

export const UsersPage = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [usersMetaInfo, setUsersMetaInfo] = useState<UsersMetaInfo>({
    totalAmount: 0,
    sortBy: "",
    sortOrder: "asc",
  });

  const [appError, setAppError] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const isPending = loadingStatus === "pending";

  useEffect(() => {
    if (appError) {
      api["error"]({ message: appError, placement: "bottomLeft" });
    }
  }, [appError, api]);

  const usersDataWithKey = useMemo(() => {
    return usersData.map((user) => {
      user.date = formatDate(user.date);
      return { ...user, key: user.id };
    });
  }, [usersData]);

  const fetchUsers = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const users = await usersApi.fetchUsers();

      if (!isEqualTwoArrays(usersData, users.data)) {
        setUsersData(users.data);
        setUsersMetaInfo(users.meta);
      }
      setLoadingStatus(() => "succeed");
    } catch (err) {
      setAppError(() => getErrorMessage(err));
      setLoadingStatus(() => "failed");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        ViewCell: RolesViewCell,
        EditorCell: RolesEditForm,
      },
      isBlocked: {
        ViewCell: IsBlockedViewCell,
        EditorCell: IsBlockedEditForm,
      },
    };

    return {
      ...col,
      onCell: (record: UserWithKey) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        isLoading: isPending,
        onUpdate: fetchUsers,
        ViewCell: extraColumnPropsMap[col.dataIndex].ViewCell,
        EditorCell: extraColumnPropsMap[col.dataIndex].EditorCell,
      }),
    };
  });

  const handleDeleteUser = async (userId: number) => {
    try {
      await usersApi.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <>
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
      {contextHolder}
    </>
  );
};

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  isLoading,
  onUpdate,
  EditorCell,
  ViewCell,
  ...restProps
}) => {
  const [editMode, setEditMode] = useState(false);
  let childNode = children;

  if (editable && record) {
    const { key, ...restRecordProps } = record;

    childNode = editMode ? (
      <EditorCell
        key={key}
        onUpdate={onUpdate}
        isLoading={isLoading}
        toggleEditMode={() => setEditMode(false)}
        record={restRecordProps}
      />
    ) : (
      <ViewCell key={key} toggleEditMode={() => setEditMode(true)} record={restRecordProps} />
    );
  }

  return <td {...restProps}>{childNode}</td>;
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

const RolesEditForm = ({ record, toggleEditMode, isLoading, onUpdate }: EditorCellProps) => {
  const [roles, setRoles] = useState<string[]>(record.roles);

  const rolesOptions: CheckboxOptionType<string>[] = [
    { label: "USER", value: "USER" },
    { label: "MODERATOR", value: "MODERATOR" },
    { label: "ADMIN", value: "ADMIN" },
  ];

  const handleUpdateUserRights = async () => {
    try {
      await usersApi.updateUserRights(record.id, { roles: roles as Roles[] });
      toggleEditMode();
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <Flex align="center" justify="space-around">
      <Checkbox.Group
        options={rolesOptions}
        value={roles}
        disabled={isLoading}
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
          disabled={roles.length === 0 || isLoading}
          onClick={handleUpdateUserRights}
        />
        <Button
          size="small"
          variant="outlined"
          color="blue"
          icon={<CloseOutlined />}
          disabled={roles.length === 0 || isLoading}
          onClick={toggleEditMode}
        />
      </Flex>
    </Flex>
  );
};

const IsBlockedEditForm = ({ toggleEditMode, record, isLoading, onUpdate }: EditorCellProps) => {
  const [isBlockedStatus, setIsBlockedStatus] = useState(record.isBlocked);

  const handleUpdateIsBlockedStatus = async () => {
    try {
      if (record.isBlocked) {
        await usersApi.unblockUser(record.id);
      } else {
        await usersApi.blockUser(record.id);
      }
      toggleEditMode();
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
    toggleEditMode();
  };

  return (
    <Flex align="center" justify="space-around">
      <Switch
        checked={isBlockedStatus}
        onChange={() => setIsBlockedStatus((prev) => !prev)}
        disabled={isLoading}
      />
      <Flex gap="small">
        <Button
          size="small"
          variant="solid"
          color="blue"
          icon={<CheckOutlined />}
          onClick={handleUpdateIsBlockedStatus}
          disabled={isLoading}
        />
        <Button
          size="small"
          variant="outlined"
          color="blue"
          icon={<CloseOutlined />}
          onClick={toggleEditMode}
          disabled={isLoading}
        />
      </Flex>
    </Flex>
  );
};

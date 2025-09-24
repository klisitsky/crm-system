import { formatDate } from "@/utils/formatDate";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import type { Roles, User, UserFilters, UsersMetaInfo } from "@/types/users";
import type { CheckboxOptionType, TableProps } from "antd";
import type { ChangeEvent, ReactNode } from "react";
import type { LoadingStatus } from "@/types/common";
import { CustomModal } from "@/components/CustomModal/CustomModal";
import Modal from "antd/lib/modal";
import Popconfirm from "antd/lib/popconfirm";
import { Empty, Input } from "antd/lib";

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
  const [totalUsersAmount, setTotalUsersAmount] = useState<number>(0);
  const [userFilters, setUserFilters] = useState<UserFilters>({});

  const [appError, setAppError] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const isPending = loadingStatus === "pending";

  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const users = await usersApi.fetchUsers(userFilters);
      const fetchingUsersData = users.data ?? [];

      if (!isEqualTwoArrays(usersData, fetchingUsersData)) {
        setUsersData(fetchingUsersData);
        setTotalUsersAmount(users.meta.totalAmount);
      }
      setLoadingStatus(() => "succeed");
    } catch (err) {
      setAppError(() => getErrorMessage(err));
      setLoadingStatus(() => "failed");
    }
  }, [userFilters]);

  useEffect(() => {
    if (appError) {
      api["error"]({ message: appError, placement: "bottomLeft" });
    }
  }, [appError, api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, userFilters]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: "Имя",
      dataIndex: "username",
      width: 200,
      ellipsis: true,
      sorter: true,
    },
    {
      title: "Почта",
      dataIndex: "email",
      width: 200,
      ellipsis: true,
      sorter: true,
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
      dataIndex: "actions",
      render: (_, record) => {
        const handleMoveToUserPage = () => {};

        const handleDeletingConfirm = async () => {
          try {
            await usersApi.deleteUser(record.id);
            setOpenModal(false);
            fetchUsers();
          } catch (err) {
            alert(getErrorMessage(err));
          }
        };

        return (
          <>
            <Button type="link" icon={<UserOutlined key="user" onClick={handleMoveToUserPage} />}>
              Перейти к профилю
            </Button>
            <Popconfirm
              title={`Вы уверены, что хотите удалить пользователя ${record.username}?`}
              onConfirm={handleDeletingConfirm}
              okText="Да"
              cancelText="Нет"
            >
              {!isAdmin(record) && (
                <Button
                  type="link"
                  icon={<DeleteFilled key="delete" />}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              )}
            </Popconfirm>
          </>
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

  const handleTableChange: TableProps<UserWithKey>["onChange"] = (pagination, _, sorter) => {
    const { field, order } = Array.isArray(sorter) ? sorter[0] : sorter;
    const sortOrder = order === "ascend" ? "asc" : "desc";

    const isSortingField = String(field) !== "undefined";
    const currentPage = pagination.current ? pagination.current - 1 : undefined;

    setUserFilters({
      ...userFilters,
      sortBy: isSortingField ? String(field) : undefined,
      sortOrder: isSortingField ? sortOrder : undefined,
      limit: pagination.pageSize,
      page: currentPage,
    });
  };

  const usersDataWithKey = useMemo(() => {
    return usersData.map((user) => {
      user.date = formatDate(user.date);
      return { ...user, key: user.id };
    });
  }, [usersData]);
  console.log(userFilters.page);

  return (
    <>
      <Card>
        <Typography.Title level={2}>Управление пользователями</Typography.Title>
        <Input
          placeholder="Поиск по имени или почте..."
          addonBefore={<SearchOutlined />}
          style={{ width: "400px", marginBottom: "20px" }}
          value={userFilters.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUserFilters({
              ...userFilters,
              search: e.currentTarget.value,
              page: e.currentTarget.value ? 0 : undefined,
            });
          }}
        />
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
          pagination={{
            current: userFilters.page ? userFilters.page + 1 : 1,
            defaultPageSize: 20,
            total: totalUsersAmount,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: <Empty description="Таких пользователей нет"></Empty> }}
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

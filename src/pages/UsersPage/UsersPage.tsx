import { usersApi } from "@/api/usersApi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Checkbox, Flex, notification, Switch, Table, Tag, Typography } from "antd";
import { Empty, Input, Select } from "antd/lib";
import Popconfirm from "antd/lib/popconfirm";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { Link } from "react-router-dom";
import { USERS_PATH } from "@/components/constants/paths";
import type { CheckboxOptionType, TableProps } from "antd";
import type { Roles, User, UserFilters } from "@/types/users";
import type { LoadingStatus } from "@/types/common";
import type { ChangeEvent, ReactNode } from "react";

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
  isAdminRole?: boolean;
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
  isAdminRole: boolean;
  onUpdate: () => void;
}

const isAdminUser = (record: User): boolean => {
  return record.id === 1 || record.id === 2;
};

export const UsersPage = () => {
  const { data: profileData } = useAppSelector(selectProfileRequestData);
  const isAdminRole = profileData?.roles.includes("ADMIN");

  const [usersData, setUsersData] = useState<User[]>([]);
  const [totalUsersAmount, setTotalUsersAmount] = useState<number>(0);
  const [userFilters, setUserFilters] = useState<UserFilters>({ limit: 20, page: 0 });
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search);

  const [appError, setAppError] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const isLoading = loadingStatus === "pending";

  const fetchUsers = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const users = await usersApi.fetchUsers({
        ...userFilters,
        search: debouncedSearch ? debouncedSearch : undefined,
      });
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
  }, [userFilters, debouncedSearch]);

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
            fetchUsers();
          } catch (err) {
            alert(getErrorMessage(err));
          }
        };

        return (
          <>
            <Button type="link" icon={<UserOutlined key="user" onClick={handleMoveToUserPage} />}>
              <Link to={`${USERS_PATH}/${record.id}`}>Перейти к профилю</Link>
            </Button>
            <Popconfirm
              title={`Вы уверены, что хотите удалить пользователя ${record.username}?`}
              onConfirm={handleDeletingConfirm}
              okText="Да"
              cancelText="Нет"
            >
              {!isAdminUser(record) && isAdminRole && (
                <Button type="link" icon={<DeleteFilled key="delete" />} />
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
        isLoading,
        isAdminRole,
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

  return (
    <>
      <Card>
        <Typography.Title level={2}>Управление пользователями</Typography.Title>
        <Flex justify="space-between">
          <Input
            placeholder="Поиск по имени или почте..."
            addonBefore={<SearchOutlined />}
            style={{ width: "400px", marginBottom: "20px" }}
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.currentTarget.value);
            }}
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            onChange={(e: string) => {
              const selectValuesMap: Record<string, boolean | undefined> = {
                all: undefined,
                blocked: true,
                unblocked: false,
              };
              setUserFilters({
                ...userFilters,
                isBlocked: selectValuesMap[e],
              });
            }}
            options={[
              { value: "all", label: "Все" },
              { value: "blocked", label: "Заблокированные" },
              { value: "unblocked", label: "Активные" },
            ]}
          />
        </Flex>
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
  isAdminRole,
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
        isAdminRole={isAdminRole}
        toggleEditMode={() => setEditMode(false)}
        record={restRecordProps}
      />
    ) : (
      <ViewCell
        key={key}
        isAdminRole={isAdminRole}
        toggleEditMode={() => setEditMode(true)}
        record={restRecordProps}
      />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const RolesViewCell = ({ record, toggleEditMode, isAdminRole }: CellProps) => {
  const startEdit = () => {
    if (!isAdminUser(record) && isAdminRole) {
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
    if (!isAdminUser(record)) {
      toggleEditMode();
    }
  };

  return (
    <Button type="text" onClick={startEdit}>
      <Tag color={record.isBlocked ? "volcano" : "green"}>
        {record.isBlocked ? "Заблокирован" : "Активный"}
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

import Button from "antd/es/button/button";
import Table from "antd/es/table/Table";
import Tag from "antd/es/tag";
import Flex from "antd/es/flex";
import Checkbox from "antd/es/checkbox";
import Switch from "antd/es/switch";
import Empty from "antd/es/empty";
import Popconfirm from "antd/es/popconfirm";
import CheckOutlined from "@ant-design/icons/lib/icons/CheckOutlined";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import { usersApi } from "@/api/usersApi";
import { USERS_PATH } from "@/components/constants/paths";
import { useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { FC, ReactNode } from "react";
import type { CheckboxOptionType } from "antd/es/checkbox";
import type { TableProps } from "antd/es/table/InternalTable";
import type { Roles, User, UserFilters } from "@/types/users";

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
  record: UserWithKey;
  isAdminRole?: boolean;
  toggleEditMode: () => void;
}

interface EditorCellProps extends CellProps {
  isLoading?: boolean;
  onUpdate?: () => void;
  setAppError: (error: string) => void;
}

interface EditableCellProps extends CustomizeCellComponents {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof UserWithKey;
  record: UserWithKey;
  isLoading: boolean;
  isAdminRole: boolean;
  setAppError: (error: string) => void;
  onUpdate: () => void;
}

const isAdminUser = (record: User): boolean => {
  return record.id === 1 || record.id === 2;
};

interface UsersTable {
  usersData: User[];
  userFilters: UserFilters;
  setUserFilters: (userFilters: UserFilters) => void;
  totalUsersAmount: number;
  fetchUsers: () => void;
  setAppError: (error: string) => void;
  isLoading: boolean;
}

export const UsersTable: FC<UsersTable> = ({
  usersData,
  userFilters,
  setUserFilters,
  fetchUsers,
  isLoading,
  totalUsersAmount,
  setAppError
}) => {
  const { data: profileData } = useAppSelector(selectProfileRequestData);
  const isAdminRole = profileData?.roles.includes("ADMIN");

  const columns = useMemo(() => {
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
        render: (value) => formatDate(value.date)
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
          const handleDeletingConfirm = async () => {
            try {
              await usersApi.deleteUser(record.id);
              fetchUsers();
            } catch (err) {
              setAppError(getErrorMessage(err));
            }
          };

          return (
            <>
              <Button type="link" icon={<UserOutlined key="user" />}>
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

    return defaultColumns.map((col) => {
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
          setAppError,
          onUpdate: fetchUsers,
          ViewCell: extraColumnPropsMap[col.dataIndex].ViewCell,
          EditorCell: extraColumnPropsMap[col.dataIndex].EditorCell,
        }),
      };
    });
  }, [fetchUsers, isAdminRole, isLoading]);

  const usersDataWithKey = useMemo(() => {
    return usersData.map((user) => {
      return { ...user, key: user.id };
    });
  }, [usersData]);

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

  return (
    <Table<UserWithKey>
      columns={columns as ColumnTypes}
      bordered
      components={{
        body: {
          cell: EditableTableCell,
        },
      }}
      dataSource={usersDataWithKey}
      showSorterTooltip={{ target: "sorter-icon" }}
      size="small"
      pagination={{
        current: userFilters.page ? userFilters.page + 1 : 1,
        defaultPageSize: userFilters.limit,
        total: totalUsersAmount,
      }}
      onChange={handleTableChange}
      locale={{ emptyText: <Empty description="Таких пользователей нет" /> }}
    />
  );
};

const EditableTableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  isLoading,
  isAdminRole,
  setAppError,
  onUpdate,
  EditorCell,
  ViewCell,
  ...restProps
}) => {
  const [editMode, setEditMode] = useState(false);
  let childNode = children;

  if (editable && record) {
    childNode = editMode ? (
      <EditorCell
        key={record.key}
        onUpdate={onUpdate}
        isLoading={isLoading}
        isAdminRole={isAdminRole}
        toggleEditMode={() => setEditMode(false)}
        record={record}
        setAppError={setAppError}
      />
    ) : (
      <ViewCell
        key={record.key}
        isAdminRole={isAdminRole}
        toggleEditMode={() => setEditMode(true)}
        record={record}
      />
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const RolesViewCell = ({ record, toggleEditMode, isAdminRole }: CellProps) => {
  const startEdit = useCallback(() => {
    if (!isAdminUser(record) && isAdminRole) {
      toggleEditMode();
    }
  }, [record, isAdminRole, toggleEditMode]);

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

const RolesEditForm = ({
  record,
  toggleEditMode,
  isLoading,
  onUpdate,
  setAppError,
}: EditorCellProps) => {
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
      setAppError(getErrorMessage(err));
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

const IsBlockedEditForm = ({
  toggleEditMode,
  record,
  isLoading,
  onUpdate,
  setAppError,
}: EditorCellProps) => {
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
      setAppError(getErrorMessage(err));
    }
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

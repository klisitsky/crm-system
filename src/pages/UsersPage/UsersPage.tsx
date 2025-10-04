import { usersApi } from "@/api/usersApi";
import { useErrorNotification } from "@/hooks/useAppError";
import { useDebounce } from "@/hooks/useDebounce";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Typography } from "antd";
import { Input, Select } from "antd/lib";
import { useCallback, useEffect, useState } from "react";
import { UsersTable } from "./UsersTable/UsersTable";
import type { LoadingStatus } from "@/types/common";
import type { User, UserFilters } from "@/types/users";
import type { ChangeEvent } from "react";

const BlockFilterMap = {
  all: undefined,
  blocked: true,
  unblocked: false,
} as const;

type BlockFilterKey = keyof typeof BlockFilterMap;

export const UsersPage = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [totalUsersAmount, setTotalUsersAmount] = useState<number>(0);
  const [userFilters, setUserFilters] = useState<UserFilters>({ limit: 20, page: 0 });

  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search);

  const [appError, setAppError] = useState<string>("");
  const contextHolder = useErrorNotification(appError);

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
    fetchUsers();
  }, [fetchUsers]);

  const handleChangeIsBlockedStatus = (e: BlockFilterKey) => {
    setUserFilters({
      ...userFilters,
      isBlocked: BlockFilterMap[e],
    });
  };

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
            onChange={handleChangeIsBlockedStatus}
            options={[
              { value: "all", label: "Все" },
              { value: "blocked", label: "Заблокированные" },
              { value: "unblocked", label: "Активные" },
            ]}
          />
        </Flex>
        <UsersTable
          usersData={usersData}
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          totalUsersAmount={totalUsersAmount}
          fetchUsers={fetchUsers}
          setAppError={setAppError}
          isLoading={isLoading}
        />
      </Card>
      {contextHolder}
    </>
  );
};

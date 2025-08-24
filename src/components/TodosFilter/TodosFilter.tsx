import { Button, Flex } from "antd";
import { Typography } from "antd";
import { memo } from "react";
import s from "./TodosFilter.module.scss";
import type { Dispatch } from "react";
import type { FilterStatus, TodoInfo } from "@/types/todos";

const { Text } = Typography;

interface TodosFilter {
  isLoading: boolean;
  filterStatus: FilterStatus;
  todoInfo: TodoInfo;
  setfilterStatus: Dispatch<React.SetStateAction<FilterStatus>>;
}

export const TodosFilter: React.FC<TodosFilter> = memo(
  ({ isLoading, filterStatus, todoInfo, setfilterStatus }) => {
    const { all, inWork, completed } = todoInfo;

    return (
      <Flex justify="space-around" style={{ padding: "5px" }}>
        <Button
          type={"text"}
          disabled={isLoading}
          onClick={() => setfilterStatus("all")}
        >
          <Text
            className={`${filterStatus === "all" ? s.active : ""}`}
          >{`Все (${all})`}</Text>
        </Button>
        <Button
          type={"text"}
          disabled={isLoading}
          onClick={() => setfilterStatus("inWork")}
        >
          <Text
            className={`${filterStatus === "inWork" ? s.active : ""}`}
          >{`В работе (${inWork})`}</Text>
        </Button>
        <Button
          type={"text"}
          disabled={isLoading}
          onClick={() => setfilterStatus("completed")}
        >
          <Text
            className={`${filterStatus === "completed" ? s.active : ""}`}
          >{`Сделано (${completed})`}</Text>
        </Button>
      </Flex>
    );
  }
);

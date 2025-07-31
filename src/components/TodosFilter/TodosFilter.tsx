import { Button, Flex } from "antd";
import { Typography } from "antd";
import { memo } from "react";
import type { FilterStatus, TodoInfo } from "../../types/todos";
import s from './TodosFilter.module.scss'

const { Text } = Typography;

interface TodosFilter {
  filterStatus: FilterStatus;
  todoInfo: TodoInfo;
  fetchTodosByFilter: (filterStatus: FilterStatus) => Promise<void>;
}

export const TodosFilter: React.FC<TodosFilter> = memo(
  ({ filterStatus, todoInfo, fetchTodosByFilter }) => {
    const { all, inWork, completed } = todoInfo;

    return (
      <Flex justify="space-around" style={{ padding: "5px" }}>
        <Button type={"text"} onClick={() => fetchTodosByFilter("all")}>
          <Text
            className={`${filterStatus === "all" ? s.active : ""}`}
          >{`Все (${all ?? 0})`}</Text>
        </Button>
        <Button type={"text"} onClick={() => fetchTodosByFilter("inWork")}>
          <Text
            className={`${filterStatus === "inWork" ? s.active : ""}`}
          >{`В работе (${inWork ?? 0})`}</Text>
        </Button>
        <Button type={"text"} onClick={() => fetchTodosByFilter("completed")}>
          <Text
            className={`${filterStatus === "completed" ? s.active : ""}`}
          >{`Сделано (${completed ?? 0})`}</Text>
        </Button>
      </Flex>
    );
  }
);

import { Button, Flex, Typography } from "antd";
import { memo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import { todosSlice } from "../../pages/TodoListPage/todosSlice";
import type { FilterStatus } from "../../types/todos";
import s from "./TodosFilter.module.scss";

const { Text } = Typography;

export const TodosFilter: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const { all, completed, inWork } = useAppSelector(
    todosSlice.selectors.selectTodosInfo
  );
  const filterStatus = useAppSelector(todosSlice.selectors.selectFilterStatus);

  const fetchTodosByFilter = (filterStatus: FilterStatus) => {
    dispatch(todosSlice.actions.updateFilterStatus(filterStatus));
  };

  return (
    <Flex justify="space-around" style={{ padding: "5px" }}>
      <Button type={"text"} onClick={() => fetchTodosByFilter("all")}>
        <Text
          className={`${filterStatus === "all" ? s.active : ""}`}
        >{`Все (${all})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => fetchTodosByFilter("inWork")}>
        <Text
          className={`${filterStatus === "inWork" ? s.active : ""}`}
        >{`В работе (${inWork})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => fetchTodosByFilter("completed")}>
        <Text
          className={`${filterStatus === "completed" ? s.active : ""}`}
        >{`Сделано (${completed})`}</Text>
      </Button>
    </Flex>
  );
});

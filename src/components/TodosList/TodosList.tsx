import { List, Typography } from "antd";
import { memo } from "react";
import { useAppSelector } from "../../app/redux";
import { TodoCard } from "../TodoCard/TodoCard";
import { todosSlice } from "../../pages/TodoListPage/todosSlice";

export const TodosList: React.FC = memo(() => {
  const todosData = useAppSelector(todosSlice.selectors.selectTodosData);

  return todosData.length ? (
    <List
      split={false}
      dataSource={todosData}
      renderItem={(todo) => (
        <List.Item style={{ padding: 0, margin: "15px 0" }}>
          <TodoCard todo={todo} key={todo.id}>
            {todo.title}
          </TodoCard>
        </List.Item>
      )}
    />
  ) : (
    <Typography.Title level={4} type="secondary">
      Список задач пуст
    </Typography.Title>
  );
});

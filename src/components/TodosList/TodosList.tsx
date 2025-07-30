import { List, Typography } from "antd";
import { memo } from "react";
import { TodoCard } from "../TodoCard/TodoCard";
import type { Todo } from "../../types/todos";

interface TodosList {
  todos: Todo[];
  isLoading: boolean;
  onUpdate?: () => Promise<void>;
}

export const TodosList: React.FC<TodosList> = memo(
  ({ todos, isLoading, onUpdate }) => {
    return todos.length ? (
      <List
        split={false}
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item style={{ padding: 0, margin: "15px 0" }}>
            <TodoCard
              isLoading={isLoading}
              onUpdate={onUpdate}
              todo={todo}
              key={todo.id}
            >
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
  }
);

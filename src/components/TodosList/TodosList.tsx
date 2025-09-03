import { TodoCard } from "@/components/TodoCard/TodoCard";
import { List, Typography } from "antd";
import { memo } from "react";
import type { Todo } from "@/types/todos";

interface TodosList {
  todosData: Todo[];
  isLoading: boolean;
  onUpdate?: () => Promise<void>;
  updateMode?: (mode: boolean) => void;
}

export const TodosList: React.FC<TodosList> = memo(
  ({ todosData, isLoading, onUpdate, updateMode }) => {
    return todosData.length ? (
      <List
        split={false}
        dataSource={todosData}
        renderItem={(todo) => (
          <List.Item style={{ padding: 0, margin: "15px 0" }}>
            <TodoCard
              key={todo.id}
              todo={todo}
              isLoading={isLoading}
              onUpdate={onUpdate}
              updateMode={updateMode}
            />
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

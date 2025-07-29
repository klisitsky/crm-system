import { Typography } from "antd";
import Flex from "antd/es/flex";
import { TaskCard } from "../TaskCard/taskCard";
import type { Task } from "../../api/tasksApi";


interface TasksList {
  tasks: Task[];
  isLoading: boolean;
  updateTask: (taskId: number, isDone: boolean, title: string) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

export const TasksList: React.FC<TasksList> = ({
  tasks,
  isLoading,
  updateTask,
  deleteTask,
}) => {
  return tasks.length ? (
    <Flex gap="small" vertical>
      {tasks.map((task) => {
        return (
            <TaskCard
              isLoading={isLoading}
              updateTask={updateTask}
              deleteTask={deleteTask}
              task={task}
              key={task.id}
            >
              {task.title}
            </TaskCard>
        );
      })}
    </Flex>
  ) : (
    <Typography.Title level={4} type="secondary">Список задач пуст</Typography.Title>
  );
};

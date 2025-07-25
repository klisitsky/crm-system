import type { TasksInfoAmount } from "../../api/tasksApi";
import type { FilterStatus } from "../../features/Todolist/useTodolist";
import { Button, Flex } from "antd";
import { Typography } from "antd";
import s from "./tasksFilter.module.scss";

const { Text } = Typography;

interface TasksFilter {
  filterStatus: FilterStatus;
  tasksInfoAmount: TasksInfoAmount;
  filterTasksByStatus: (filterStatus: FilterStatus) => void;
}

export const TasksFilter: React.FC<TasksFilter> = ({
  filterStatus,
  tasksInfoAmount,
  filterTasksByStatus,
}) => {
  const { all, inWork, completed } = tasksInfoAmount;

  return (
    <Flex justify="space-between">
      <Button type={"text"} onClick={() => filterTasksByStatus("all")}>
        <Text
          className={`${filterStatus === "all" ? s.active : ""}`}
        >{`Все (${all ?? 0})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => filterTasksByStatus("inWork")}>
        <Text
          className={`${filterStatus === "inWork" ? s.active : ""}`}
        >{`В работе (${inWork ?? 0})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => filterTasksByStatus("completed")}>
        <Text
          className={`${filterStatus === "completed" ? s.active : ""}`}
        >{`Сделано (${completed ?? 0})`}</Text>
      </Button>
    </Flex>
  );
};

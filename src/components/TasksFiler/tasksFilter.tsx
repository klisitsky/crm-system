import type { TasksInfoAmount } from "../../api/tasksApi";
import type { FilterStatus } from "../../features/Todolist/useTodolist";
import { Button, Flex } from "antd";
import { Typography } from "antd";
import s from "./tasksFilter.module.scss";

const { Text } = Typography;

interface TasksFilter {
  filterStatus: FilterStatus;
  tasksInfoAmount: TasksInfoAmount;
  fetchTasksByFilter: (filterStatus?: FilterStatus | undefined) => void;
}

export const TasksFilter: React.FC<TasksFilter> = ({
  filterStatus,
  tasksInfoAmount,
  fetchTasksByFilter,
}) => {
  const { all, inWork, completed } = tasksInfoAmount;

  return (
    <Flex justify="space-between">
      <Button type={"text"} onClick={() => fetchTasksByFilter()}>
        <Text
          className={`${filterStatus === "all" ? s.active : ""}`}
        >{`Все (${all ?? 0})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => fetchTasksByFilter("inWork")}>
        <Text
          className={`${filterStatus === "inWork" ? s.active : ""}`}
        >{`В работе (${inWork ?? 0})`}</Text>
      </Button>
      <Button type={"text"} onClick={() => fetchTasksByFilter("completed")}>
        <Text
          className={`${filterStatus === "completed" ? s.active : ""}`}
        >{`Сделано (${completed ?? 0})`}</Text>
      </Button>
    </Flex>
  );
};

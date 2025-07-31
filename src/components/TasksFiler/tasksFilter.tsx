import type { TasksInfoAmount } from "../../api/tasksApi";
import type { FilterStatus } from "../../pages/TodolistPage/useTodolistPage";
import { Button } from "../ui/Button/button";
import { Typography } from "../ui/Typography/typography";
import s from "./tasksFilter.module.scss";

interface TasksFilter {
  filterStatus: FilterStatus;
  tasksInfoAmount: TasksInfoAmount;
  fetchTasksByFilter: (filterStatus?: FilterStatus) => Promise<void>;
}

export const TasksFilter: React.FC<TasksFilter> = ({
  filterStatus,
  tasksInfoAmount,
  fetchTasksByFilter,
}) => {
  const { all, inWork, completed } = tasksInfoAmount;

  return (
    <div className={s.buttonsContainer}>
      <Button onClick={() => fetchTasksByFilter()} className={s.button}>
        <Typography
          className={`${s.textButton} ${filterStatus === "all" ? s.active : ""}`}
        >{`Все (${all ?? 0})`}</Typography>
      </Button>
      <Button
        onClick={() => fetchTasksByFilter("inWork")}
        className={s.button}
      >
        <Typography
          className={`${s.textButton} ${filterStatus === "inWork" ? s.active : ""}`}
        >{`В работе (${inWork ?? 0})`}</Typography>
      </Button>
      <Button
        onClick={() => fetchTasksByFilter("completed")}
        className={s.button}
      >
        <Typography
          className={`${s.textButton} ${filterStatus === "completed" ? s.active : ""}`}
        >{`Сделано (${completed ?? 0})`}</Typography>
      </Button>
    </div>
  );
};

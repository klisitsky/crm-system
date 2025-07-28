import type { TasksInfoAmount } from "../../api/tasksApi";
import type { FilterStatus } from "../../pages/TodolistPage/useTodolistPage";
import { Button } from "../ui/Button/button";
import { Typography } from "../ui/Typography/typography";
import s from "./tasksFilter.module.scss";

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
    <div className={s.buttonsContainer}>
      <Button onClick={() => filterTasksByStatus("all")} className={s.button}>
        <Typography
          className={`${s.textButton} ${filterStatus === "all" ? s.active : ""}`}
        >{`Все (${all ?? 0})`}</Typography>
      </Button>
      <Button
        onClick={() => filterTasksByStatus("inWork")}
        className={s.button}
      >
        <Typography
          className={`${s.textButton} ${filterStatus === "inWork" ? s.active : ""}`}
        >{`В работе (${inWork ?? 0})`}</Typography>
      </Button>
      <Button
        onClick={() => filterTasksByStatus("completed")}
        className={s.button}
      >
        <Typography
          className={`${s.textButton} ${filterStatus === "completed" ? s.active : ""}`}
        >{`Сделано (${completed ?? 0})`}</Typography>
      </Button>
    </div>
  );
};

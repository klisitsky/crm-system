import { type Task } from "../../api/tasksApi";
import { TaskCard } from "../TaskCard/taskCard";
import s from "./taskList.module.scss";

interface TasksList {
  tasks: Task[];
  isLoading: boolean;
  updateTask: (taskId: number, isDone: boolean, title: string) => void;
  deleteTask: (taskId: number) => void;
}

export const TasksList: React.FC<TasksList> = ({ tasks, isLoading, updateTask, deleteTask }) => {
  return tasks?.length ? (
    <ul className={s.list}>
      {tasks.map((task) => {
        return (
          <li className={s.listItem} key={task.id}>
            <TaskCard isLoading={isLoading} updateTask={updateTask} deleteTask={deleteTask} task={task}>
              {task.title}
            </TaskCard>
            {}
          </li>
        );
      })}
    </ul>
  ) : (
    <div className={s.epmtyTaskListTitle}>Список задач пуст</div>
  );
};

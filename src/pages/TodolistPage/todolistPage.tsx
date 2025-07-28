import { AddTaskForm } from "../../components/AddTaskForm/addTaskForm";
import { TasksFilter } from "../../components/TasksFiler/tasksFilter";
import { TasksList } from "../../components/TasksList/tasksList";
import { Loader } from "../../components/ui/Loader/Loader";
import { SnackBar } from "../../components/ui/SnackBar/snackBar";
import { useTodolistPage } from "./useTodolistPage";

export const TodolistPage = () => {

  const {
    isLoading,
    filterStatus,
    tasksData,
    appError,
    filterTasksByStatus,
    addNewTask,
    updateTask,
    deleteTask,
  } = useTodolistPage();

  return (
    <>
      <AddTaskForm isLoading={isLoading} addNewTask={addNewTask} />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <TasksFilter
            filterStatus={filterStatus}
            tasksInfoAmount={tasksData.info}
            filterTasksByStatus={filterTasksByStatus}
          />
          <TasksList
            isLoading={isLoading}
            updateTask={updateTask}
            deleteTask={deleteTask}
            tasks={tasksData.data}
          />
        </>
      )}
      {appError && <SnackBar>{appError}</SnackBar>}
    </>
  );
};

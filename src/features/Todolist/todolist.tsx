import { Flex, Spin } from "antd";
import { AddTaskForm } from "../../components/AddTaskForm/addTaskForm";
import { TasksFilter } from "../../components/TasksFiler/tasksFilter";
import { TasksList } from "../../components/TasksList/tasksList";
import { LoadingOutlined } from "@ant-design/icons";
import { useTodolist } from "./useTodolist";

export const Todolist = () => {
  const {
    isLoading,
    filterStatus,
    tasksData,
    contextHolder,
    fetchTasksByFilter,
    addNewTask,
    updateTask,
    deleteTask,
  } = useTodolist();

  return (
    <Flex gap="small" vertical>
      <AddTaskForm isLoading={isLoading} addNewTask={addNewTask} />
      <TasksFilter
        filterStatus={filterStatus}
        tasksInfoAmount={tasksData.info}
        fetchTasksByFilter={fetchTasksByFilter}
      />
      {isLoading ? (
        <Spin size="large" indicator={<LoadingOutlined spin />} />
      ) : (
        <>
          <TasksList
            isLoading={isLoading}
            updateTask={updateTask}
            deleteTask={deleteTask}
            tasks={tasksData.data}
          />
        </> 
      )}
      {contextHolder}
    </Flex>
  );
};

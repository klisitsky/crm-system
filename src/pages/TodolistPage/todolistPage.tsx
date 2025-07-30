import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row, Spin } from "antd";
import { AddTaskForm } from "../../components/AddTaskForm/addTaskForm";
import { TasksFilter } from "../../components/TasksFiler/tasksFilter";
import { TasksList } from "../../components/TasksList/tasksList";
import { useTodolistPage } from "./useTodolistPage";

export const TodolistPage = () => {
  const {
    isLoading,
    filterStatus,
    tasksData,
    contextHolder,
    fetchTasksByFilter,
    addNewTask,
    updateTask,
    deleteTask,
  } = useTodolistPage();

  return (
    <>
      <Row>
        <Col span={8} offset={8}>
          <AddTaskForm isLoading={isLoading} addNewTask={addNewTask} />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TasksFilter
            filterStatus={filterStatus}
            tasksInfoAmount={tasksData.info}
            fetchTasksByFilter={fetchTasksByFilter}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
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
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

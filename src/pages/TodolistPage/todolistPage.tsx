import { LoadingOutlined } from "@ant-design/icons";
import { Col, notification, Row, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { fetchTodos } from "../../api/todoApi";
import { AddTodoForm } from "../../components/AddTodoForm/AddTodoForm";
import { TodosFilter } from "../../components/TodosFiler/TodosFilter";
import { TodosList } from "../../components/TodosList/TodosList";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { FilterStatus, Todo, TodoInfo } from "../../types/todos";

type LoadingStatus = "idle" | "pending" | "succeed" | "failed";

export const TodolistPage = () => {
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [appError, setAppError] = useState<string>("");
  const [filterStatus, setfilterStatus] = useState<FilterStatus>("all");
  const [api, contextHolder] = notification.useNotification();
  const isLoading = loadingStatus === "pending";

  if (appError) api["error"]({ message: appError, placement: "bottomLeft" });

  const fetchTodosByFilter = useCallback(
    async (filterStatus: FilterStatus) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        const todos = await fetchTodos(filterStatus);
        setTodosData(() => todos.data);
        setTodosInfo(
          () => todos.info ?? { all: 0, completed: 0, inWork: 0 }
        );
        setLoadingStatus(() => "succeed");
        setfilterStatus(filterStatus);
      } catch (err) {
        setAppError(() => getErrorMessage(err));
        setLoadingStatus(() => "failed");
      }
    },
    []
  );

  useEffect(() => {
    fetchTodosByFilter('all');
  }, [fetchTodosByFilter]);

  return (
    <>
      <Row>
        <Col span={8} offset={8}>
          <AddTodoForm isLoading={isLoading} onUpdate={() => fetchTodosByFilter(filterStatus)} />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosFilter
            filterStatus={filterStatus}
            todoInfo={todosInfo}
            fetchTodosByFilter={fetchTodosByFilter}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          {isLoading ? (
            <Spin size="large" indicator={<LoadingOutlined spin />} />
          ) : (
            <>
              <TodosList
                isLoading={isLoading}
                onUpdate={() => fetchTodosByFilter(filterStatus)}
                todos={todosData}
              />
            </>
          )}
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

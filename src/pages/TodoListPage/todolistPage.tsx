import { fetchTodos } from "@/api/todosApi";
import { AddTodoForm } from "@/components/AddTodoForm/AddTodoForm";
import { TodosFilter } from "@/components/TodosFilter/TodosFilter";
import { TodosList } from "@/components/TodosList/TodosList";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { Col, notification, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { FilterStatus, Todo, TodoInfo } from "@/types/todos";

type LoadingStatus = "idle" | "pending" | "succeed" | "failed";

const TODOS_UPDSATE_TIME = 5_000;

export const TodoListPage = () => {
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [filterStatus, setfilterStatus] = useState<FilterStatus>("all");

  const [appError, setAppError] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();

  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");

  const isLoading = loadingStatus === "pending";

  useEffect(() => {
    if (appError) {
      api["error"]({ message: appError, placement: "bottomLeft" });
    }
  }, [appError]);

  const fetchTodosByFilter = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const todos = await fetchTodos(filterStatus);
      if (!isEqualTwoArrays(todosData, todos.data)) {
        setTodosData(todos.data);
      }
      if (todos.info) {
        setTodosInfo(todos.info);
      }

      setLoadingStatus(() => "succeed");
    } catch (err) {
      setAppError(() => getErrorMessage(err));
      setLoadingStatus(() => "failed");
    }
  }, [todosData, filterStatus]);

  useEffect(() => {
    if (!isUpdateMode) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchTodosByFilter();
    }, TODOS_UPDSATE_TIME);
    fetchTodosByFilter();

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTodosByFilter, filterStatus, isUpdateMode, todosData]);

  return (
    <>
      <Row>
        <Col span={8} offset={8}>
          <AddTodoForm
            isLoading={isLoading}
            onUpdate={() => fetchTodosByFilter()}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosFilter
            isLoading={isLoading}
            filterStatus={filterStatus}
            todoInfo={todosInfo}
            setfilterStatus={setfilterStatus}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosList
            isLoading={isLoading}
            todos={todosData}
            onUpdate={() => fetchTodosByFilter()}
            updateMode={setIsUpdateMode}
          />
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

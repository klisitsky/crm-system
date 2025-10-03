import { todosApi } from "@/api/todosApi";
import { AddTodoForm } from "@/components/AddTodoForm/AddTodoForm";
import { TODOS_UPDATE_TIME } from "@/components/constants/todos";
import { TodosFilter } from "@/components/TodosFilter/TodosFilter";
import { TodosList } from "@/components/TodosList/TodosList";
import { useErrorNotification } from "@/hooks/useAppError";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { LoadingStatus } from "@/types/common";
import type { FilterStatus, Todo, TodoInfo } from "@/types/todos";

export const TodoListPage: React.FC = () => {
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({
    all: 0,
    inWork: 0,
    completed: 0,
  });
  const [filterStatus, setfilterStatus] = useState<FilterStatus>("all");

  const [appError, setAppError] = useState<string>("");
  const contextHolder = useErrorNotification(appError);
  
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");

  const isPending = loadingStatus === "pending";


  const fetchTodosByFilter = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const todos = await todosApi.fetchTodos(filterStatus);
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
  }, [filterStatus]);

  useEffect(() => {
    if (!isUpdateMode) {
      return;
    }
    const intervalId = setInterval(fetchTodosByFilter, TODOS_UPDATE_TIME);
    fetchTodosByFilter();

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTodosByFilter, isUpdateMode]);

  return (
    <>
      <Row>
        <Col span={8} offset={8}>
          <AddTodoForm isLoading={isPending} onUpdate={() => fetchTodosByFilter()} />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosFilter
            isLoading={isPending}
            filterStatus={filterStatus}
            todoInfo={todosInfo}
            setfilterStatus={setfilterStatus}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosList
            isLoading={isPending}
            todosData={todosData}
            onUpdate={() => fetchTodosByFilter()}
            updateMode={setIsUpdateMode}
          />
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

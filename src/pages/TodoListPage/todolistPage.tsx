import { TODOS_UPDATE_TIME } from "@/components/constants/todos";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { fetchTodos, todosSlice } from "./todosSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { AddTodoForm } from "@/components/AddTodoForm/AddTodoForm";
import { TodosFilter } from "@/components/TodosFilter/TodosFilter";
import { TodosList } from "@/components/TodosList/TodosList";

export const TodoListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isUpdatingTodosMode = useAppSelector(todosSlice.selectors.selectUpdatingTodosMode);
  const filterStatus = useAppSelector(todosSlice.selectors.selectFilterStatus);

  useEffect(() => {
    if (!isUpdatingTodosMode) {
      return;
    }

    const intervalId = setInterval(() => {
      dispatch(fetchTodos({ filterStatus }));
    }, TODOS_UPDATE_TIME);
    dispatch(fetchTodos({ filterStatus }));

    return () => {
      clearInterval(intervalId);
    };
  }, [isUpdatingTodosMode, filterStatus, dispatch]);

  return (
    <>
      <Row>
        <Col span={8} offset={8}>
          <AddTodoForm />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosFilter />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
          <TodosList />
        </Col>
      </Row>
    </>
  );
};

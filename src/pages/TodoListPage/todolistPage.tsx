import { LoadingOutlined } from "@ant-design/icons";
import { Col, Flex, Row, Spin } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import { AddTodoForm } from "../../components/AddTodoForm/AddTodoForm";
import { TodosFilter } from "../../components/TodosFilter/TodosFilter";
import { TodosList } from "../../components/TodosList/TodosList";
import { fetchTodos, todosSlice } from "./todosSlice";

const TODOS_UPDSATE_TIME = 5_000;

export const TodoListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(todosSlice.selectors.selectIsFetchTodosPending);
  const isUpdatingTodosMode = useAppSelector(todosSlice.selectors.selectUpdatingTodosMode);
  const filterStatus = useAppSelector(todosSlice.selectors.selectFilterStatus);

  useEffect(() => {
    if (!isUpdateMode) {
      return;
    }

    const intervalId = setInterval(() => {
      dispatch(fetchTodos({ filterStatus }));
    }, TODOS_UPDSATE_TIME);
    dispatch(fetchTodos({ filterStatus }));

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchTodos, isUpdatingTodosMode, filterStatus]);

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
          {isPending ? (
            <Flex justify="center">
              <Spin size="large" indicator={<LoadingOutlined spin />} />
            </Flex>
          ) : (
            <>
              <TodosList />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

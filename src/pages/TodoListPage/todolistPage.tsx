import { LoadingOutlined } from "@ant-design/icons";
import { Col, notification, Row, Spin } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import { AddTodoForm } from "../../components/AddTodoForm/AddTodoForm";
import { TodosFilter } from "../../components/TodosFilter/TodosFilter";
import { TodosList } from "../../components/TodosList/TodosList";
import { fetchTodos, todosSlice } from "./todosSlice";

export const TodoListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(
    todosSlice.selectors.selectIsFetchTodosPending
  );
  const error = useAppSelector(todosSlice.selectors.selectError);
  const isUpdatingTodosMode = useAppSelector(
    todosSlice.selectors.selectUpdatingTodosMode
  );
  const filterStatus = useAppSelector(todosSlice.selectors.selectFilterStatus);

  const [api, contextHolder] = notification.useNotification();

  if (error) api["error"]({ message: error, placement: "bottomLeft" });

  useEffect(() => {
    if (!isUpdatingTodosMode) return;

    const intervalId = setInterval(() => {
      dispatch(fetchTodos({ filterStatus }));
    }, 5000);
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
            <Spin size="large" indicator={<LoadingOutlined spin />} />
          ) : (
            <>
              <TodosList />
            </>
          )}
        </Col>
      </Row>
      {contextHolder}
    </>
  );
};

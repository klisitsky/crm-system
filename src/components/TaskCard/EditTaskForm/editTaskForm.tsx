import { useCallback } from "react";
import type { Task } from "../../../api/tasksApi";
import { Button, Flex, Form } from "antd";
import { MAX_SYMBOLS_COUNT, MIN_SYMBOLS_COUNT } from "../../AddTaskForm/addTaskForm";
import Input from "antd/es/input/Input";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import CloseCircleFilled from "@ant-design/icons/lib/icons/CloseCircleFilled";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";

interface EditTaskForm {
  task: Task;
  isLoading: boolean;
  toggleIsEdit: () => void;
  updateTask: (taskId: number, isDone: boolean, title: string) => void;
  handleDeleteTask: () => void;
}

export const EditTaskForm: React.FC<EditTaskForm> = ({
  task,
  isLoading,
  toggleIsEdit,
  updateTask,
  handleDeleteTask,
}) => {
  const [form] = Form.useForm();

  const handleChangeTaskTitle = useCallback(() => {
    form.validateFields().then((res) => {
      updateTask(task.id, task.isDone, res.taskValue);
      form.resetFields();
    });
  }, [task]);

  const handleCloseEditForm = useCallback(() => {
    toggleIsEdit();
    form.setFieldValue("taskValue", task.title);
  }, [task.title]);

  return (
    <Form form={form} validateTrigger="none">
      <Flex gap="small" align="center">
        <Form.Item
          style={{ margin: 0 }}
          name="taskValue"
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
            },
            {
              min: MIN_SYMBOLS_COUNT,
              message: "Длина менее 2 символов",
            },
            {
              max: MAX_SYMBOLS_COUNT,
              message: "Длина более 64 символов",
            },
          ]}
        >
          <Input
            disabled={isLoading}
            variant="underlined"
            size="small"
            defaultValue={task.title}
          />
        </Form.Item>
        <Flex gap="small" align="center">
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              onClick={handleChangeTaskTitle}
              disabled={isLoading}
              size="small"
              icon={<SaveFilled key="save" />}
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              onClick={handleCloseEditForm}
              disabled={isLoading}
              size="small"
              icon={<CloseCircleFilled key="close" />}
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              color="danger"
              variant="solid"
              onClick={handleDeleteTask}
              disabled={isLoading}
              size="small"
              icon={<DeleteFilled key="delete" />}
            ></Button>
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
};

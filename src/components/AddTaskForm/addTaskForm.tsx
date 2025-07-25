import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { getInputErrorMessage } from "../../utils/getInputErrorMessage";
import { Button, Flex, Typography } from "antd";
import { Input } from "antd";

interface AddTaskForm {
  addNewTask: (newTitle: string) => void;
  isLoading: boolean;
}

export const AddTaskForm: React.FC<AddTaskForm> = ({
  addNewTask,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChangeInputValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("");
      setInputValue(e.currentTarget.value);
    },
    []
  );

  const handleAddTask = useCallback(async () => {
    const errorMessageValue = getInputErrorMessage(inputValue);
    if (!errorMessageValue) {
      addNewTask(inputValue);
      setInputValue("");
      setErrorMessage("");
    } else {
      setErrorMessage(errorMessageValue);
    }
  }, [inputValue]);

  return (
    <>
      <Flex gap="large">
        <Flex vertical align="start">
          <Input
            value={inputValue}
            onChange={handleChangeInputValue}
            placeholder="Task To Be Done..."
            disabled={isLoading}
            status={errorMessage ? "error" : ""}
            variant="underlined"
            size="middle"
            style={{ backgroundColor: "transparent" }}
          />
          {errorMessage && (
            <Typography.Text type="danger">{errorMessage}</Typography.Text>
          )}
        </Flex>
        <Button
          type={"primary"}
          onClick={handleAddTask}
          disabled={isLoading}
          style={{ width: "150px" }}
        >
          Add
        </Button>
      </Flex>
    </>
  );
};

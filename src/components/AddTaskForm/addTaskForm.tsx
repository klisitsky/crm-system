import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { getInputErrorMessage } from "../../utils/getInputErrorMessage";
import { Button } from "../ui/Button/button";
import { Input } from "../ui/Input/input";
import { Typography } from "../ui/Typography/typography";
import s from "./addTaskForm.module.scss";

interface AddTaskForm {
  addNewTask: (newTitle: string) => void;
  isLoading: boolean;
}

export const AddTaskForm: React.FC<AddTaskForm> = ({ addNewTask, isLoading }) => {
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
      <div className={s.container}>
        <Input
          value={inputValue}
          onChange={handleChangeInputValue}
          errorMessage={errorMessage}
          placeholder="Task To Be Done..."
          className={s.addTaskInput}
          disabled={isLoading}
        />
        <Button
          variant="primary"
          onClick={handleAddTask}
          disabled={isLoading}
          className={s.addButton}
        >
          <Typography>Add</Typography>
        </Button>
      </div>
    </>
  );
};

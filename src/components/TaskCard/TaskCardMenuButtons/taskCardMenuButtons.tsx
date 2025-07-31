import React from "react";
import { CancelIcon } from "../../../assets/icons/cancelIcon";
import { DeleteIcon } from "../../../assets/icons/deleteIcon";
import { EditIcon } from "../../../assets/icons/editIcon";
import { SaveIcon } from "../../../assets/icons/saveIcon";
import s from "./taskCardMenuButtons.module.scss";
import { Button } from "../../ui/Button/button";

interface TaskCardMenuButtons {
  isEdit: boolean;
  isLoading: boolean;
  handleEditTaskTitle: () => void;
  handleDeleteTask: () => void;
  handleChangeTaskTitle: () => void;
  handleCancelChangedTitle: () => void;
}

export const TaskCardMenuButtons: React.FC<TaskCardMenuButtons> = ({
  isEdit,
  isLoading,
  handleEditTaskTitle,
  handleDeleteTask,
  handleChangeTaskTitle,
  handleCancelChangedTitle,
}) => {
  return (
    <div className={s.buttonsContainer}>
      {isEdit ? (
        <>
          <Button
            variant="primary"
            onClick={handleChangeTaskTitle}
            disabled={isLoading}
            className={s.button}
          >
            <SaveIcon />
          </Button>
          <Button
            variant="primary"
            onClick={handleCancelChangedTitle}
            disabled={isLoading}
            className={s.button}
          >
            <CancelIcon />
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          onClick={handleEditTaskTitle}
          disabled={isLoading}
          className={s.button}
        >
          <EditIcon />
        </Button>
      )}
      <Button
        variant="danger"
        onClick={handleDeleteTask}
        disabled={isLoading}
        className={s.button}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};

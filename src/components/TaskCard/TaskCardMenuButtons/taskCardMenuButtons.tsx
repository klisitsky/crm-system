import React from "react";
import { Button, Flex } from "antd";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import CloseCircleFilled from "@ant-design/icons/lib/icons/CloseCircleFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";

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
    <Flex gap="small">
      {isEdit ? (
        <>
          <Button
            type="primary"
            onClick={handleChangeTaskTitle}
            disabled={isLoading}
            size="small"
            icon={<SaveFilled key="save" />}
          ></Button>
          <Button
            type="primary"
            onClick={handleCancelChangedTitle}
            disabled={isLoading}
            size="small"
            icon={<CloseCircleFilled key="cancel" />}
          ></Button>
        </>
      ) : (
        <Button
          type="primary"
          onClick={handleEditTaskTitle}
          disabled={isLoading}
          size="small"
          icon={<EditFilled key="edit" />}
        ></Button>
      )}
      <Button
        color="danger"
        variant="solid"
        onClick={handleDeleteTask}
        disabled={isLoading}
        size="small"
        icon={<DeleteFilled key="delete" />}
      ></Button>
    </Flex>
  );
};

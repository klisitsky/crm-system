import Modal from "antd/lib/modal";
import { useState, type FC } from "react";

interface CustomModal {
  openMode: boolean;
  onSubmit?: () => void;
}

export const CustomModal: FC<CustomModal> = ({ openMode, onSubmit }) => {
  const [open, setOpen] = useState<boolean>(openMode);

  const onSubmitModal = () => {
    if (onSubmit) {
      onSubmit();
    }
    setOpen(false);
  };

  return (
    <Modal
      title="Вы действительно хотите удалить пользователя?"
      centered
      open={open}
      onOk={onSubmitModal}
      onCancel={() => setOpen(false)}
    />
  );
};

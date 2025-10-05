import notification from "antd/es/notification";
import { useEffect } from "react";

export const useErrorNotification = (error: string | null | undefined) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      api["error"]({ message: error, placement: "bottomLeft" });
    }
  }, [error, api]);

  return contextHolder;
};

import { isAxiosError } from "axios";

export const getErrorMessage = (err: unknown) => {
  if (isAxiosError<string>(err)) {
    return err.response?.data ?? "Network error";
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return "Unknown error";
  }
};

import { TODOS_PATH } from "@/components/constants/paths";
import type { Location } from "react-router";

export const getPathFrom = (location: Location) => {
  return location?.state?.from?.pathname || TODOS_PATH;
}

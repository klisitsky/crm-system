import type { ReactNode } from "react";
import s from "./typography.module.scss";

interface Typography {
  children: ReactNode;
  fontTypeSize?: "small" | "middle";
  className?: string;
}

export const Typography: React.FC<Typography> = ({
  children,
  fontTypeSize = "small",
  className
}) => {
  return <span className={`${s[fontTypeSize]} ${className}`}>{children}</span>;
};

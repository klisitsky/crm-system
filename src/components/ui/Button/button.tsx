import { memo, type ReactNode } from "react";
import s from "./button.module.scss";

type VariantButton = "text" | "primary" | "danger";

interface Button {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  variant?: VariantButton;
  className?: string;
}

export const Button: React.FC<Button> = memo((props) => {
  const { children, onClick, disabled, variant = "primary", className } = props;

  return (
    <button
      className={`${s.button} ${s[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

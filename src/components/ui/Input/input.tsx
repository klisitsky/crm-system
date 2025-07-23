import { memo, type ChangeEvent } from "react";
import s from "./input.module.scss";

interface Input {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Input: React.FC<Input> = memo(
  ({ placeholder, className, value, onChange, errorMessage, disabled }) => {
    const errorInputClassName = errorMessage ? s.inputError : "";

    return (
      <div className={s.inputContainer}>
        <input
          className={`${s.input} ${className} ${errorInputClassName}`}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {errorMessage && <span className={s.errorMessage}>{errorMessage}</span>}
      </div>
    );
  }
);

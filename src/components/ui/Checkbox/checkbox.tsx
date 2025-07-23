import s from "./checkbox.module.scss";

interface Checkbox {
  onChange: () => void;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
}

export const Checkbox: React.FC<Checkbox> = ({ onChange, className, checked, disabled }) => {
  return (
    <div className={`${s.container} ${className}`}>
      <input className={s.inputCheckbox} onChange={onChange} disabled={disabled} type="checkbox" checked={checked}/>
    </div>
  );
};

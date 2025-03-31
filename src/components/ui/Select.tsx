import { FC, SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  className?: string;
  legend?: string;
  helperText?: string;
  helperColor?: string;
  defaultValue?: string;
}

const Select: FC<SelectProps> = ({
  options,
  className = "",
  legend,
  helperText,
  helperColor = '',
  defaultValue = "",
  ...props
}) => {
  return (
    <fieldset className="fieldset">
      {legend && <legend className="fieldset-legend">{legend}</legend>}
      <select className={`select ${className}`} defaultValue={defaultValue} {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <span className={`fieldset-label ${helperColor}`}>{helperText}</span>}
    </fieldset>
  );
};

export default Select;

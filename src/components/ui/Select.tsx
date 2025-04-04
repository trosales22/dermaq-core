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
  inlineLegend?: boolean;
}

const Select: FC<SelectProps> = ({
  options,
  className = "",
  legend,
  helperText,
  helperColor = '',
  defaultValue = "",
  inlineLegend = false,
  ...props
}) => {
  return (
    <fieldset className="fieldset">
      {inlineLegend ? (
        <div className="flex items-center gap-2">
          {legend && <label className="ml-2 text-sm font-medium">{legend}</label>}
          <select
            className={`select ${className}`}
            defaultValue={defaultValue}
            {...props}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          {legend && <legend className="fieldset-legend">{legend}</legend>}
          <select
            className={`select ${className}`}
            defaultValue={defaultValue}
            {...props}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      )}
      {helperText && <span className={`fieldset-label ${helperColor}`}>{helperText}</span>}
    </fieldset>
  );
};

export default Select;

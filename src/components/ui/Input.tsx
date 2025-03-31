import { FC, InputHTMLAttributes, ReactNode, useState } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  ghost?: boolean;
  color?: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fieldset?: boolean;
  legend?: string;
  requirementLabel?: string;
  requirementColor?: string;
}

const Input: FC<InputProps> = ({
  label,
  icon,
  badge,
  className = "",
  ghost,
  color,
  size,
  fieldset,
  legend,
  requirementLabel = '',
  requirementColor = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value); // Check if input has a value

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const inputClass = [
    "input",
    "w-full",
    ghost ? "input-ghost" : "",
    color ? `input-${color}` : "",
    size ? `input-${size}` : "",
    className,
  ].filter(Boolean).join(" ");

  if (fieldset) {
    return (
      <fieldset className="fieldset">
        {legend && <legend className="fieldset-legend">{legend}</legend>}
        <input className={inputClass} {...props} />
        {requirementLabel && <p className={`fieldset-label ${requirementColor}`}>{requirementLabel}</p>}
      </fieldset>
    );
  }

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      {label && (
        <label
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 text-gray-500 ${
            isFocused || hasValue ? "text-xs top-2" : "text-base"
          }`}
        >
          {label}
        </label>
      )}

      <div className={`input flex items-center ${className}`}>
        {icon && <span className="h-[1em] opacity-50">{icon}</span>}
        <input
          className="w-full py-2 px-3 focus:outline-none bg-transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {badge && <span>{badge}</span>}
      </div>
    </div>
  );
};

export default Input;

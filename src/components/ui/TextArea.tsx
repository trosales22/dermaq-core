import { FC, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  fieldset?: boolean;
  legend?: string;
  optionalLabel?: string;
  optionalLabelColor?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "accent" | "neutral" | "info" | "success" | "warning" | "error";
  width?: "full" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
}

const TextArea: FC<TextAreaProps> = ({ 
  label, 
  fieldset = false, 
  legend, 
  optionalLabel, 
  optionalLabelColor = '',
  size, 
  color, 
  width = "full", 
  className = "", 
  ...props 
}) => {
  const sizeClass = size ? `textarea-${size}` : "";
  const colorClass = color ? `textarea-${color}` : "";
  
  // Width mapping
  const widthClass = {
    full: "w-full",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[width];

  const textareaElement = (
    <textarea 
      className={`textarea h-24 ${sizeClass} ${colorClass} ${widthClass} ${className}`} 
      {...props} 
    />
  );

  if (fieldset) {
    return (
      <fieldset className="fieldset">
        {legend && <legend className="fieldset-legend">{legend}</legend>}
        {textareaElement}
        {optionalLabel && <div className={`fieldset-label ${optionalLabelColor}`}>{optionalLabel}</div>}
      </fieldset>
    );
  }

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-sm font-medium">{label}</label>}
      {textareaElement}
    </div>
  );
};

export default TextArea;

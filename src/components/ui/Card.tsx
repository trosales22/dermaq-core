import { FC, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`card bg-base-100 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

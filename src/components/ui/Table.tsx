import { FC, ReactNode } from "react";

interface TableProps {
  headers: string[];
  headerColor?: string;
  borderColor?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
  rounded?: boolean;
}

const Table: FC<TableProps> = ({
  headers,
  headerColor = "",
  borderColor = "border-base-content/5",
  children,
  className = "",
  bordered = false,
  rounded = false
}) => {
  return (
    <div
      className={`${bordered ? `border ${borderColor}` : ""} ${
        rounded ? "rounded-box" : ""
      } bg-base-100 ${className}`}
    >
      <table className="table">
        <thead className={`${headerColor}`}>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;

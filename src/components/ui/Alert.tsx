import React from 'react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  icon?: React.ReactNode;
}

const alertTypes: Record<string, string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error"
};

const Alert: React.FC<AlertProps> = ({ type = 'info', message, icon }) => {
  return (
    <div role="alert" className={`alert ${alertTypes[type]} alert-soft`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default Alert;

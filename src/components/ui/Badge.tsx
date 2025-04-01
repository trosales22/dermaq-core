import React from 'react';

interface BadgeProps {
  type?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  label: string;
  textSize?: 'xs' | 'sm' | 'medium' | 'lg' | 'xl';
}

const badgeTypes: Record<string, string> = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    neutral: "badge-neutral",
    info: "badge-info",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error"
};

const badgeTextSizes: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    medium: "text-medium",
    lg: "text-large",
    xl: 'text-xl'
};

const Badge: React.FC<BadgeProps> = ({ type = 'info', label, textSize = 'xs' }) => {
    return (
        <div className={`badge badge-soft ${badgeTypes[type] || "badge-info"}`}>
            <span className={`${badgeTextSizes[textSize]}`}>{label}</span>
        </div>
    );
};

export default Badge;

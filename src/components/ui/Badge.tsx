import React from 'react';

interface BadgeProps {
  type?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error';
  label: string;
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

const Badge: React.FC<BadgeProps> = ({ type = 'info', label }) => {
    return (
        <div className={`badge badge-soft ${badgeTypes[type] || "badge-info"}`}>
            <span className='text-xs'>{label}</span>
        </div>
    );
};

export default Badge;

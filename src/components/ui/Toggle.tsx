import React from 'react';
import { UseFormRegisterReturn } from "react-hook-form";

interface ToggleProps {
    label?: string;
    register?: UseFormRegisterReturn;
    defaultChecked?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ label, register, defaultChecked = false }) => {
    return (
        <div>
            <label className="fieldset-label mt-2">
                <span className='text-black'>{label}</span>
                <input type="checkbox" defaultChecked={defaultChecked} className="toggle toggle-m toggle-primary" {...register} />
            </label>
        </div>
    );
};

export default Toggle;

'use client';

import { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({
    name,
    label,
    error,
    className,
    containerClassName,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & FormProps) => {
    return (
        <div className={containerClassName}>
            <label className="text-[14px] font-medium" htmlFor={name}>
                {label}
            </label>
            <input
                className={twMerge(
                    'h-[40px] rounded-[8px] border border-primary px-[10px] text-[14px] capitalize',
                    className
                )}
                {...props}
            />
            {error && <span className="text-error text-[14px]">{error}</span>}
        </div>
    );
};

export default Input;

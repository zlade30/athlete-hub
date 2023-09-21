import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = {
    value: string;
    className?: string;
};

const Button = ({ value, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
    return (
        <button
            {...props}
            className={twMerge(
                'w-full h-[45px] bg-primary rounded-[8px] text-[14px] text-white cursor-pointer',
                className
            )}
        >
            <p className="cursor-pointer">{value}</p>
        </button>
    );
};

export default Button;

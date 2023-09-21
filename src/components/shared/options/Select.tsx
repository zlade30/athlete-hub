'use client';

import { twMerge } from 'tailwind-merge';
import { InputHTMLAttributes, useCallback, useEffect, useState } from 'react';

const Select = ({
    data,
    name,
    label,
    error,
    className,
    onSelectItem,
    containerClassName,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & SelectProps & FormProps) => {
    const [showData, setShowData] = useState(false);

    const handleClick = () => {
        setShowData(false);
    };

    const activateEventKeys = useCallback(() => {
        document.addEventListener('click', handleClick);
    }, []);

    const removeEventKeys = useCallback(() => {
        document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        if (showData) activateEventKeys();
        else removeEventKeys();
        return () => {
            removeEventKeys();
        };
    }, [showData]);

    return (
        <div className={twMerge('relative', containerClassName)}>
            <label className="text-[14px] font-medium" htmlFor={name}>
                {label}
            </label>
            <input
                type="text"
                readOnly
                onClick={() => setShowData(true)}
                className={twMerge(
                    'h-[40px] rounded-[8px] border border-primary px-[10px] text-[14px] capitalize cursor-default',
                    className
                )}
                {...props}
            />
            {showData && (
                <div className="w-full max-h-[300px] bg-white rounded-[8px] absolute mt-[70px] shadow-[0px_10px_10px_1px_rgba(0,0,0,0.10)] border border-gray-100 z-[100] overflow-y-auto">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelectItem(item)}
                            className="text-[14px] px-[10px] py-[5px] hover:bg-secondary h-[40px] flex items-center cursor-pointer"
                        >
                            {item.value}
                        </div>
                    ))}
                </div>
            )}
            {error && <span className="text-error text-[14px]">{error}</span>}
        </div>
    );
};

export default Select;

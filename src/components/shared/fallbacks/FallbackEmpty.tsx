import { ReactElement } from 'react';

const FallbackEmpty = ({ icon, content }: { icon: ReactElement | string; content: string }) => {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-500 gap-[20px]">
            {icon}
            <p className="font-medium text-[14px] select-none">{content}</p>
        </div>
    );
};

export default FallbackEmpty;

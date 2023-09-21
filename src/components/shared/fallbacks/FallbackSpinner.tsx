const FallbackSpinner = ({ content }: { content: string }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-[20px]">
            <div className="animate-ping inline-flex h-[20px] w-[20px] rounded-[20px] bg-sky-400" />
            <p>{content}</p>
        </div>
    );
};

export default FallbackSpinner;

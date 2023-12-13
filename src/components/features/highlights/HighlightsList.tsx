import { highlight1, highlight2, highlight3, highlight4, highlight5 } from '@/public/images';
import Image from 'next/image';
import React from 'react';
import HighlightsInformation from './HighlightsInformation';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setShowHighlightInformation } from '@/redux/reducers/highlights';

const HighlightsList = () => {
    const dispatch = useDispatch();
    const { showHighlightInformation } = useAppSelector((state) => state.highlights);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative">
            <HighlightsInformation
                open={showHighlightInformation}
                handleClose={() => dispatch(setShowHighlightInformation(false))}
            />
            <div className="w-full p-[20px] flex items-center justify-between gap-[20px]">
                <div className="w-full grid grid-cols-3 items-center gap-[20px]">
                    <div
                        className="w-full h-[450px] rounded-[14px] relative"
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                    >
                        <Image src={highlight1} fill alt="img" objectFit="contain" />
                    </div>
                    <div
                        className="w-full h-[450px] rounded-[14px] relative"
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                    >
                        <Image src={highlight2} fill alt="img" objectFit="contain" />
                    </div>
                    <div
                        className="w-full h-[450px] rounded-[14px] relative"
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                    >
                        <Image src={highlight3} fill alt="img" objectFit="contain" />
                    </div>
                    <div
                        className="w-full h-[450px] rounded-[14px] relative"
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                    >
                        <Image src={highlight4} fill alt="img" objectFit="contain" />
                    </div>
                    <div
                        className="w-full h-[450px] rounded-[14px] relative"
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                    >
                        <Image src={highlight5} fill alt="img" objectFit="contain" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightsList;

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import HighlightsInformation from './HighlightsInformation';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
    removeHighlights,
    setHighlights,
    setSelectedHighlights,
    setShowAthleteSelection,
    setShowHighlightInformation,
    setShowTeamSelection
} from '@/redux/reducers/highlights';
import { DeleteIcon, EditIcon, PlusIcon, ShowIcon, TrophyIcon, UserIcon } from '@/public/icons';
import HighlightsTeamSelection from './HighlightsTeamSelection';
import { HighlightsAthleteSelection } from '.';
import { SpinnerDialog } from '@/components/shared/dialogs';
import { fbDeleteHighlights, fbGetHighlights } from '@/firebase-api/highlights';
import { formatDate } from '@/utils/helpers';
import { setShowSpinnerDialog, setShowSpinnerFallback } from '@/redux/reducers/app';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';

const HighlightsList = () => {
    const dispatch = useDispatch();
    const [isGuest, setIsGuest] = useState(false);
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { highlights, showHighlightInformation, showAthleteSelection, showTeamSelection } = useAppSelector(
        (state) => state.highlights
    );

    const loadHighlights = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching highlights...' }));
            const data = await fbGetHighlights();
            dispatch(setHighlights(data));
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        } catch (error) {
            console.log(error);
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        }
    };

    const handleAthletes = (item: HighlightProps) => {
        const total = item.teams.reduce((accumulator, currentObject) => {
            return accumulator + currentObject.players.length;
        }, 0);
        return total + item.athletes.length;
    };

    const handleSelectedHighlight = (item: HighlightProps) => {
        dispatch(setSelectedHighlights(item));
        dispatch(setShowHighlightInformation(true));
    };

    const handleDelete = async (item: HighlightProps) => {
        try {
            dispatch(setShowHighlightInformation(false));
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing highlight...' }));
            await fbDeleteHighlights(item?.id!);
            dispatch(removeHighlights(item?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
        }
    };

    const memoizedHandleAthletes = useMemo(() => handleAthletes, [highlights]);

    useEffect(() => {
        loadHighlights();
    }, []);

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative pb-[20px]">
            <HighlightsInformation
                open={showHighlightInformation}
                handleClose={() => dispatch(setShowHighlightInformation(false))}
            />
            <HighlightsTeamSelection
                open={showTeamSelection}
                handleClose={() => dispatch(setShowTeamSelection(false))}
            />
            <HighlightsAthleteSelection
                open={showAthleteSelection}
                handleClose={() => dispatch(setShowAthleteSelection(false))}
            />
            <SpinnerDialog />
            <div className="w-full p-[20px] flex items-center justify-end gap-[20px]">
                {!isGuest && (
                    <PlusIcon
                        onClick={() => dispatch(setShowHighlightInformation(true))}
                        className="w-[20px] h-[20px] cursor-pointer"
                    />
                )}
            </div>
            <div className="w-full grid grid-cols-1 items-center gap-[20px] px-[20px]">
                {highlights.map((item) => (
                    <div
                        key={item.id}
                        className="w-full flex items-center h-[300px] rounded-[14px] relative bg-[#ffffff]"
                    >
                        <Image className="px-[40px]" src={item.image} width={250} height={250} alt="highlight" />
                        <div className="w-full flex flex-col p-[20px]">
                            <div className="w-full flex items-center justify-between">
                                <p className="text-[40px] font-bold">{item.name}</p>
                                {isGuest && (
                                    <ShowIcon
                                        onClick={() => handleSelectedHighlight(item)}
                                        className="w-[30px] h-[30px] cursor-pointer"
                                    />
                                )}
                                {!isGuest && (
                                    <div className="flex items-center gap-[20px]">
                                        <EditIcon
                                            onClick={() => handleSelectedHighlight(item)}
                                            className="w-[20px] h-[20px] cursor-pointer"
                                        />
                                        <DeleteIcon
                                            onClick={() => handleDelete(item)}
                                            className="w-[20px] h-[20px] cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-[30px] font-medium">{formatDate(new Date(item.date))}</p>
                            <div className="w-full grid grid-cols-2 text-[20px] font-normal py-[20px]">
                                <p className="w-full text-center">Teams Participated</p>
                                <p className="w-full text-center">Athletes</p>
                            </div>
                            <div className="w-full grid grid-cols-2 text-[20px] font-normal">
                                <p className="w-full text-center text-[50px]">{item.teams.length}</p>
                                <p className="w-full text-center text-[50px]">{memoizedHandleAthletes(item)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showSpinnerFallback.show && <FallbackSpinner content="Fetching highlights..." />}
            {highlights.length === 0 && !showSpinnerFallback.show && (
                <FallbackEmpty icon={<TrophyIcon className="w-[50px] h-[50px]" />} content="List is currently empty." />
            )}
        </div>
    );
};

export default HighlightsList;

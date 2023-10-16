import React from 'react';
import { Popup } from '.';
import { useDispatch } from 'react-redux';
import {
    removePlayer,
    setSelectedPlayer,
    setShowPlayerAchievements,
    setShowPlayerInformation
} from '@/redux/reducers/players';
import { usePathname } from 'next/navigation';
import { removeCoach, setSelectedCoach, setShowCoachInformation } from '@/redux/reducers/coaches';
import { removeTeam, setSelectedTeam, setShowTeamInformation } from '@/redux/reducers/teams';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { fbDeleteTeam } from '@/firebase-api/teams';
import { fbDeleteCoach } from '@/firebase-api/coaches';
import { fbDeletePlayer } from '@/firebase-api/player';

const PlayerActionPopup = ({
    open,
    onClose,
    person
}: PopupProps & { person: PlayerProps | CoachProps | TeamProps }) => {
    const path = usePathname();
    const dispatch = useDispatch();
    const actions = ['Update', 'Achievements', 'Delete'];

    const handleSelectedAction = async (action: string) => {
        switch (action) {
            case 'Update':
                if (path.includes('players')) {
                    dispatch(setShowPlayerInformation(true));
                    dispatch(setSelectedPlayer(person as PlayerProps));
                } else if (path.includes('coaches')) {
                    dispatch(setShowCoachInformation(true));
                    dispatch(setSelectedCoach(person as CoachProps));
                } else if (path.includes('teams')) {
                    dispatch(setShowTeamInformation(true));
                    dispatch(setSelectedTeam(person as TeamProps));
                }
                break;
            case 'Delete':
                if (path.includes('players')) {
                    dispatch(setShowSpinnerDialog({ open: true, content: 'Removing player...' }));
                    await fbDeletePlayer(person?.id!);
                    dispatch(removePlayer(person?.id!));
                } else if (path.includes('coaches')) {
                    dispatch(setShowSpinnerDialog({ open: true, content: 'Removing coach...' }));
                    await fbDeleteCoach(person?.id!);
                    dispatch(removeCoach(person?.id!));
                } else if (path.includes('teams')) {
                    dispatch(setShowSpinnerDialog({ open: true, content: 'Removing team...' }));
                    await fbDeleteTeam(person?.id!);
                    dispatch(removeTeam(person?.id!));
                }
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                break;
            case 'Achievements':
                dispatch(setShowPlayerAchievements(true));
                dispatch(setSelectedPlayer(person as PlayerProps));
                break;
            default:
                break;
        }
    };

    return (
        <Popup open={open} onClose={onClose}>
            <div className="w-full max-h-[300px] bg-white rounded-[8px] shadow-[0px_10px_10px_1px_rgba(0,0,0,0.10)] border border-gray-100 overflow-y-auto">
                {actions.map((action) => (
                    <div
                        key={action}
                        onClick={() => handleSelectedAction(action)}
                        className="text-[14px] px-[20px] py-[5px] hover:bg-secondary h-[40px] flex items-center cursor-pointer"
                    >
                        {action}
                    </div>
                ))}
            </div>
        </Popup>
    );
};

export default PlayerActionPopup;

'use client';

import Image from 'next/image';
import { defaultProfileImg } from '@/public/images';
import { MenuIcon, ShowIcon, TrophyIcon } from '@/public/icons';
import { PlayerActionPopup } from './popups';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import {
    setPlayers,
    setSelectedPlayer,
    setShowPlayerAchievements,
    setShowPlayerInformation
} from '@/redux/reducers/players';
import { usePathname } from 'next/navigation';
import { setCoaches, setSelectedCoach, setShowCoachInformation } from '@/redux/reducers/coaches';

const PersonBox = ({ person }: { person: PlayerProps | CoachProps }) => {
    const path = usePathname();
    const dispatch = useDispatch();
    const { players } = useAppSelector((state) => state.player);
    const { coaches } = useAppSelector((state) => state.coaches);
    const [isGuest, setIsGuest] = useState(false);

    const handleAction = (action: 'show' | 'hide') => {
        if (action === 'show') {
            if (path.includes('players')) {
                dispatch(
                    setPlayers(
                        players.map((item) => (item.id === person.id ? { ...item, selected: !item.selected } : item))
                    )
                );
            } else {
                dispatch(
                    setCoaches(
                        coaches.map((item) => (item.id === person.id ? { ...item, selected: !item.selected } : item))
                    )
                );
            }
        } else {
            if (path.includes('players')) {
                dispatch(
                    setPlayers(players.map((item) => (item.id === person.id ? { ...item, selected: false } : item)))
                );
            } else {
                dispatch(
                    setCoaches(coaches.map((item) => (item.id === person.id ? { ...item, selected: false } : item)))
                );
            }
        }
    };

    const handleView = () => {
        if (path.includes('players')) {
            dispatch(setShowPlayerInformation(true));
            dispatch(setSelectedPlayer(person as PlayerProps));
        } else if (path.includes('coaches')) {
            dispatch(setShowCoachInformation(true));
            dispatch(setSelectedCoach(person as CoachProps));
        }
    };

    const handleAchievements = () => {
        dispatch(setShowPlayerAchievements(true));
        dispatch(setSelectedPlayer(person as PlayerProps));
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    return (
        <div className="bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center p-[20px] relative">
            {path.includes('players') && person.achievements > 0 && (
                <div className="absolute left-0 top-0 mt-[8px] ml-[12px] flex items-center gap-[4px]">
                    <p className="text-[14px]">{person.achievements}</p>
                    <TrophyIcon onClick={handleAchievements} className="w-[24px] h-[24px] mr-[12px] cursor-pointer" />
                </div>
            )}
            {!isGuest ? (
                <div className="absolute right-0 top-0">
                    <MenuIcon
                        onClick={() => handleAction('show')}
                        className="w-[18px] h-[18px] mr-[12px] mt-[12px] cursor-pointer"
                    />
                    <PlayerActionPopup open={person.selected!} onClose={() => handleAction('hide')} person={person} />
                </div>
            ) : (
                <div className="absolute right-0 top-0">
                    <ShowIcon onClick={handleView} className="w-[24px] h-[24px] mr-[12px] mt-[12px] cursor-pointer" />
                </div>
            )}
            <div className="w-[80px] h-[80px] rounded-[80px] relative mb-[10px]">
                <Image
                    className="rounded-[80px] object-cover"
                    src={person.profile || defaultProfileImg}
                    fill
                    alt="profile"
                />
            </div>
            <div className="text-center mt-[10px]">
                <p className="font-medium">{person.firstName}</p>
                <p className="font-medium">{person.lastName}</p>
            </div>
        </div>
    );
};

export default PersonBox;

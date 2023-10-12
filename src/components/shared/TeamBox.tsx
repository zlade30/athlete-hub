'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { defaultProfileImg } from '@/public/images';
import { setCurrentInfo } from '@/redux/reducers/app';
import { setSelectedPlayers, setSelectedTeam, setShowTeamInformation, setTeams } from '@/redux/reducers/teams';
import { MenuIcon, ShowIcon } from '@/public/icons';
import { PlayerActionPopup } from './popups';
import { useEffect, useState } from 'react';

const TeamBox = ({ team }: { team: TeamProps }) => {
    const dispatch = useDispatch();
    const { teams } = useAppSelector((state) => state.teams);
    const [isGuest, setIsGuest] = useState(false);

    const handleSelectedTeam = () => {
        dispatch(setCurrentInfo('team-info'));
        dispatch(setSelectedTeam(team));
        dispatch(setSelectedPlayers(team.players));
    };

    const handleAction = (action: 'show' | 'hide') => {
        if (action === 'show') {
            dispatch(
                setTeams(teams.map((item) => (item.id === team.id ? { ...item, selected: !item.selected } : item)))
            );
        } else {
            dispatch(setTeams(teams.map((item) => (item.id === team.id ? { ...item, selected: false } : item))));
        }
    };

    const handleView = () => {
        dispatch(setShowTeamInformation(true));
        dispatch(setSelectedTeam(team));
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    return (
        <div
            onClick={handleSelectedTeam}
            className="bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center justify-center p-[20px] cursor-pointer relative"
        >
            {!isGuest ? (
                <div className="absolute right-0 top-0">
                    <MenuIcon
                        onClick={() => handleAction('show')}
                        className="w-[18px] h-[18px] mr-[12px] mt-[12px] cursor-pointer"
                    />
                    <PlayerActionPopup open={team.selected!} onClose={() => handleAction('hide')} person={team} />
                </div>
            ) : (
                <div className="absolute right-0 top-0">
                    <ShowIcon onClick={handleView} className="w-[24px] h-[24px] mr-[12px] mt-[12px] cursor-pointer" />
                </div>
            )}
            <div className="w-[80px] h-[80px] rounded-[80px] relative mb-[10px]">
                <Image
                    fill
                    alt="profile"
                    className="rounded-[80px] object-cover"
                    src={team.profile || defaultProfileImg}
                />
            </div>
            <div className="text-center mt-[10px]">
                <p className="font-medium">{team.name}</p>
            </div>
        </div>
    );
};

export default TeamBox;

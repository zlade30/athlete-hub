'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { defaultProfileImg } from '@/public/images';
import { setCurrentInfo } from '@/redux/reducers/app';
import { setSelectedPlayers, setSelectedTeam, setTeams } from '@/redux/reducers/teams';
import { MenuIcon } from '@/public/icons';
import { PlayerActionPopup } from './popups';

const TeamBox = ({ team }: { team: TeamProps }) => {
    const dispatch = useDispatch();
    const { teams } = useAppSelector((state) => state.teams);

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

    return (
        <div
            onClick={handleSelectedTeam}
            className="bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center justify-center p-[20px] cursor-pointer relative"
        >
            <div className="absolute right-0 top-0">
                <MenuIcon
                    onClick={() => handleAction('show')}
                    className="w-[18px] h-[18px] mr-[12px] mt-[12px] cursor-pointer"
                />
                <PlayerActionPopup open={team.selected!} onClose={() => handleAction('hide')} person={team} />
            </div>
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

'use client';

import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { defaultProfileImg } from '@/public/images';
import { setCurrentInfo } from '@/redux/reducers/app';
import { setSelectedPlayers, setSelectedTeam } from '@/redux/reducers/teams';

const TeamBox = ({ team }: { team: TeamProps }) => {
    const dispatch = useDispatch();
    const { selectedTeam } = useAppSelector((state) => state.teams);

    const handleSelectedTeam = () => {
        dispatch(setCurrentInfo('team-info'));
        dispatch(setSelectedTeam(team));
        dispatch(setSelectedPlayers(team.players));
    };

    return (
        <div
            onClick={handleSelectedTeam}
            className={twMerge(
                'bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center justify-center p-[20px] hover:bg-[#d5d6db] cursor-pointer',
                selectedTeam?.id === team?.id && 'bg-[#d5d6db]'
            )}
        >
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

'use client';

import Image from 'next/image';
import { defaultProfileImg } from '@/public/images';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const SelectTeamBox = ({
    team,
    handleSelectedTeam,
    ...props
}: {
    team: TeamProps | TeamHighlightProps;
    handleSelectedTeam: (_: TeamProps | TeamHighlightProps) => void;
} & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            onClick={() => handleSelectedTeam(team)}
            className={twMerge(
                'bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center p-[20px] hover:bg-[#d5d6db] cursor-pointer border border-primary',
                team?.selected && 'bg-[#d5d6db]'
            )}
        >
            <div className="w-[80px] h-[80px] rounded-[80px] relative mb-[10px]">
                <Image
                    className="rounded-[80px] object-cover"
                    src={team.profile || defaultProfileImg}
                    fill
                    alt="profile"
                />
            </div>
            <div className="text-center mt-[10px]">
                <p className="font-medium">{team.name}</p>
            </div>
        </div>
    );
};

export default SelectTeamBox;

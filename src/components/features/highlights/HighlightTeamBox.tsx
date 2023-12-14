import { CancelIcon } from '@/public/icons';
import { defaultProfileImg } from '@/public/images';
import { setSelectedTeams } from '@/redux/reducers/highlights';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import React from 'react';
import { useDispatch } from 'react-redux';

const HightlightTeamBox = ({ isGuest, team }: { isGuest: boolean; team: TeamHighlightProps }) => {
    const dispatch = useDispatch();
    const { selectedTeams } = useAppSelector((state) => state.highlights);

    const handleRemoveTeam = () => {
        const removeTeams = selectedTeams.filter((item) => item.id !== team.id);
        dispatch(setSelectedTeams(removeTeams));
    };

    return (
        <div
            className="border border-primary rounded-[8px] flex flex-col items-center text-[14px] py-[10px]"
            key={team.id}
        >
            {!isGuest && (
                <div className="w-full flex items-center justify-end pr-[12px]">
                    <CancelIcon onClick={handleRemoveTeam} className="w-[14px] h-[14px] cursor-pointer" />
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

export default HightlightTeamBox;

import { CancelIcon } from '@/public/icons';
import { defaultProfileImg } from '@/public/images';
import { setSelectedAthletes } from '@/redux/reducers/highlights';
import { setSelectedPlayers } from '@/redux/reducers/teams';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

const TeamPlayerBox = ({ isGuest, player }: { isGuest: boolean; player: TeamPlayerProps }) => {
    const dispatch = useDispatch();
    const { selectedPlayers } = useAppSelector((state) => state.teams);
    const { selectedAthletes } = useAppSelector((state) => state.highlights);
    const path = usePathname();

    const handleRemovePlayer = () => {
        if (path.includes('highlights')) {
            const removePlayer = selectedAthletes.filter((item) => item.id !== player.id);
            dispatch(setSelectedAthletes(removePlayer));
        } else {
            const removePlayer = selectedPlayers.filter((item) => item.id !== player.id);
            dispatch(setSelectedPlayers(removePlayer));
        }
    };

    return (
        <div
            className="border border-primary rounded-[8px] flex flex-col items-center text-[14px] py-[10px]"
            key={player.id}
        >
            {!isGuest && (
                <div className="w-full flex items-center justify-end pr-[12px]">
                    <CancelIcon onClick={handleRemovePlayer} className="w-[14px] h-[14px] cursor-pointer" />
                </div>
            )}
            <div className="w-[80px] h-[80px] rounded-[80px] relative mb-[10px]">
                <Image
                    fill
                    alt="profile"
                    className="rounded-[80px] object-cover"
                    src={player.profile || defaultProfileImg}
                />
            </div>
            <div className="text-center mt-[10px]">
                <p className="font-medium">{player.firstName}</p>
                <p className="font-medium">{player.lastName}</p>
            </div>
        </div>
    );
};

export default TeamPlayerBox;

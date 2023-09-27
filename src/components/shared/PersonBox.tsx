'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { defaultProfileImg } from '@/public/images';
import { setSelectedPlayer } from '@/redux/reducers/players';
import { twMerge } from 'tailwind-merge';
import { setCurrentInfo } from '@/redux/reducers/app';

const PersonBox = ({ player }: { player: PlayerProps }) => {
    const dispatch = useDispatch();
    const { selectedPlayer } = useAppSelector((state) => state.player);

    const handleSelectedPerson = () => {
        dispatch(setCurrentInfo('player-info'));
        dispatch(setSelectedPlayer(player));
    };

    return (
        <div
            onClick={handleSelectedPerson}
            className={twMerge(
                'bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center p-[20px] hover:bg-[#d5d6db] cursor-pointer',
                selectedPlayer?.id === player?.id && 'bg-[#d5d6db]'
            )}
        >
            <div className="w-[80px] h-[80px] rounded-[80px] relative mb-[10px]">
                <Image
                    className="rounded-[80px] object-cover"
                    src={player.profile || defaultProfileImg}
                    fill
                    alt="profile"
                />
            </div>
            <div className="text-center mt-[10px]">
                <p className="font-medium">{player.firstName}</p>
                <p className="font-medium">{player.lastName}</p>
            </div>
        </div>
    );
};

export default PersonBox;

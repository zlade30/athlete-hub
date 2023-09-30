'use client';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { defaultProfileImg } from '@/public/images';
import { setSelectedPlayer } from '@/redux/reducers/players';
import { twMerge } from 'tailwind-merge';
import { setCurrentInfo } from '@/redux/reducers/app';
import { usePathname } from 'next/navigation';
import { setSelectedCoach } from '@/redux/reducers/coaches';

const PersonBox = ({ person }: { person: PlayerProps | CoachProps }) => {
    const path = usePathname();
    const dispatch = useDispatch();
    const { selectedPlayer } = useAppSelector((state) => state.player);
    const { selectedCoach } = useAppSelector((state) => state.coaches);

    const selectedPerson = () => {
        if (path === '/players') return selectedPlayer;
        else if (path === '/coaches') return selectedCoach;
    };

    const handleSelectedPerson = () => {
        if (path === '/players') {
            dispatch(setCurrentInfo('player-info'));
            dispatch(setSelectedPlayer(person as PlayerProps));
        } else if (path === '/coaches') {
            dispatch(setCurrentInfo('coach-info'));
            dispatch(setSelectedCoach(person as CoachProps));
        }
    };

    return (
        <div
            onClick={handleSelectedPerson}
            className={twMerge(
                'bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center p-[20px] hover:bg-[#d5d6db] cursor-pointer',
                selectedPerson()?.id === person?.id && 'bg-[#d5d6db]'
            )}
        >
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

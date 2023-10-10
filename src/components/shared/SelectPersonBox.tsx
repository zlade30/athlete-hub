'use client';

import Image from 'next/image';
import { defaultProfileImg } from '@/public/images';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

const SelectPersonBox = ({
    person,
    handleSelectedPerson,
    ...props
}: {
    person: PlayerProps | CoachProps;
    handleSelectedPerson: (_: PlayerProps | CoachProps) => void;
} & HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            {...props}
            onClick={() => handleSelectedPerson(person)}
            className={twMerge(
                'bg-white group w-[200px] h-[200px] rounded-[8px] flex flex-col items-center p-[20px] hover:bg-[#d5d6db] cursor-pointer',
                person?.selected && 'bg-[#d5d6db]'
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

export default SelectPersonBox;

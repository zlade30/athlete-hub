'use client';

import { useAppSelector } from '@/redux/store';
import { BarangayInformation } from '../features/barangay';
import { PlayerInformation } from '../features/players';
import Image from 'next/image';
import { defaultProfileImg } from '@/public/images';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

const Information = () => {
    const { currentInfo } = useAppSelector((state) => state.app);
    const [currentUser, setCurrentUser] = useState<User>();

    const renderInformation = () => {
        if (currentInfo === 'barangay-info') return <BarangayInformation />;
        else if (currentInfo === 'player-info') return <PlayerInformation />;
    };

    useEffect(() => {
        const user: User = JSON.parse(localStorage.getItem('user')!);
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <section className="w-[400px] h-full bg-white border-l border-l-gray-200">
            <div className="w-full h-[60px] flex items-center gap-[20px] justify-end px-[20px] border-b border-b-gray-200">
                <p className="font-medium">{currentUser?.email}</p>
                <Image
                    className="cursor-pointer"
                    src={currentUser?.photoURL! || defaultProfileImg}
                    alt="profile"
                    width={35}
                    height={35}
                />
            </div>
            {renderInformation()}
        </section>
    );
};

export default Information;

'use client';

import { useAppSelector } from '@/redux/store';
import { BarangayInformation } from '../features/barangay';
import Image from 'next/image';
import { defaultProfileImg } from '@/public/images';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { CoachesInformation } from '../features/coaches';
import { PlayersInformation } from '../features/players';
import { TeamInformation } from '../features/teams';
import { SportsInformation } from '../features/sports';

const Information = () => {
    const { currentInfo } = useAppSelector((state) => state.app);
    const [currentUser, setCurrentUser] = useState<User>();

    // const renderInformation = () => {
    //     if (currentInfo === 'barangay-info') return <BarangayInformation />;
    //     else if (currentInfo === 'player-info') return <PlayersInformation />;
    //     else if (currentInfo === 'coach-info') return <CoachesInformation />;
    //     else if (currentInfo === 'team-info') return <TeamInformation />;
    //     else if (currentInfo === 'sport-info') return <SportsInformation />;
    // };

    // useEffect(() => {
    //     const user: User = JSON.parse(localStorage.getItem('user')!);
    //     if (user) {
    //         setCurrentUser(user);
    //     }
    // }, []);

    return <section className="w-[400px] h-full bg-white border-l border-l-gray-200">adasdsad</section>;
};

export default Information;

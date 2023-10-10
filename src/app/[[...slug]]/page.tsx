'use client';

import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { CoachesList } from '@/components/features/coaches';
import { PlayersList } from '@/components/features/players';
import { TeamsList } from '@/components/features/teams';
import { SportsList } from '@/components/features/sports';

const Page = () => {
    const path = usePathname();
    const isPlayerPage = path?.includes('players');
    const isCoachPage = path?.includes('coaches');
    const isTeamPage = path?.includes('teams');
    const isSportPage = path?.includes('sports');

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (!id) redirect('sign-in');
    }, []);

    if (isPlayerPage) return <PlayersList />;
    if (isCoachPage) return <CoachesList />;
    if (isTeamPage) return <TeamsList />;
    if (isSportPage) return <SportsList />;
};

export default Page;

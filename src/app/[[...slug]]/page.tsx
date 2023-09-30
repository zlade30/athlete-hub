'use client';

import { CoachList } from '@/components/features/coaches';
import { PlayersList } from '@/components/features/players';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
    const path = usePathname();
    const isPlayerPage = path?.includes('players');
    const isCoachPage = path?.includes('coaches');

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (!id) redirect('sign-in');
    }, []);

    if (isPlayerPage) return <PlayersList />;
    if (isCoachPage) return <CoachList />;
};

export default Page;

'use client';

import { PlayersList } from '@/components/features/players';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
    const path = usePathname();
    const isPlayerPage = path?.includes('players');

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (!id) redirect('sign-in');
    }, []);

    if (isPlayerPage) return <PlayersList />;
};

export default Page;

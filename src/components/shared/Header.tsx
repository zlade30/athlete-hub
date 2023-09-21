'use client';

import { useDispatch } from 'react-redux';
import { Button } from './buttons';
import { usePathname } from 'next/navigation';
import { setSelectedPlayer } from '@/redux/reducers/players';
import { setCurrentInfo } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';

const Header = () => {
    const dispatch = useDispatch();
    const path = usePathname()?.replace('/', '');
    const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'All';
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [isGuest, setIsGuest] = useState(false);

    const handleNewPlayer = () => {
        dispatch(setSelectedPlayer(undefined));
        dispatch(setCurrentInfo('player-info'));
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    return (
        <header className="w-full h-[60px] bg-white flex items-center justify-between px-[20px] border-b border-b-gray-200">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-[20px]">
                    <p className="text-[24px] font-bold">{title}</p>
                    {selectedBarangay !== 'All' && <div className="w-[2px] h-[30px] bg-gray-400" />}
                    <p className="text-[24px] font-bold">{selectedBarangay === 'All' ? '' : selectedBarangay}</p>
                </div>
                {!isGuest && <Button onClick={handleNewPlayer} value="New Player" className="w-[150px]" />}
            </div>
        </header>
    );
};

export default Header;

'use client';

import { useDispatch } from 'react-redux';
import { Button } from './buttons';
import { usePathname } from 'next/navigation';
import { setSelectedPlayer } from '@/redux/reducers/players';
import { setCurrentInfo } from '@/redux/reducers/app';
import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import { setSelectedCoach } from '@/redux/reducers/coaches';
import { setSelectedPlayers, setSelectedTeam } from '@/redux/reducers/teams';
import { setSelectedSport } from '@/redux/reducers/sports';

const Header = () => {
    const dispatch = useDispatch();
    const path = usePathname()?.replace('/', '');
    const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'All';
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [isGuest, setIsGuest] = useState(false);

    const handleClick = () => {
        if (path === 'players') {
            dispatch(setCurrentInfo('player-info'));
            dispatch(setSelectedPlayer(undefined));
        } else if (path === 'coaches') {
            dispatch(setCurrentInfo('coach-info'));
            dispatch(setSelectedCoach(undefined));
        } else if (path === 'teams') {
            dispatch(setCurrentInfo('team-info'));
            dispatch(setSelectedTeam(undefined));
            dispatch(setSelectedPlayers([]));
        } else if (path === 'sports') {
            dispatch(setCurrentInfo('sport-info'));
            dispatch(setSelectedSport(undefined));
        }
    };

    const handleBtnText = () => {
        if (path === 'players') return 'New Player';
        else if (path === 'coaches') return 'New Coach';
        else if (path === 'teams') return 'New Team';
        else if (path === 'sports') return 'New Sport';
        return '';
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
                {!isGuest && <Button onClick={handleClick} value={handleBtnText()} className="w-[150px]" />}
            </div>
        </header>
    );
};

export default Header;

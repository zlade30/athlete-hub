'use client';

import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from 'firebase/auth';
import { defaultProfileImg } from '@/public/images';

const Header = () => {
    const path = usePathname()?.replace('/', '');
    const [currentUser, setCurrentUser] = useState<User>();
    const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'All';
    const { selectedBarangay } = useAppSelector((state) => state.barangay);

    useEffect(() => {
        const user: User = JSON.parse(localStorage.getItem('user')!);
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    return (
        <header className="w-full h-[60px] bg-white flex items-center justify-between px-[20px] border-b border-b-gray-200">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-[20px]">
                    <p className="text-[24px] font-bold">{title}</p>
                    {selectedBarangay !== 'All' && <div className="w-[2px] h-[30px] bg-gray-400" />}
                    <p className="text-[24px] font-bold whitespace-nowrap">
                        {selectedBarangay === 'All' ? '' : selectedBarangay}
                    </p>
                </div>
                <div className="w-full h-[60px] flex items-center gap-[20px] justify-end border-b border-b-gray-200">
                    <p className="font-medium">{currentUser?.email}</p>
                    <Image
                        className="cursor-pointer"
                        src={currentUser?.photoURL! || defaultProfileImg}
                        alt="profile"
                        width={35}
                        height={35}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;

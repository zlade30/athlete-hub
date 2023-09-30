'use client';

import { redirect, usePathname, useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Button } from './buttons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import Image from 'next/image';
import { logoImg } from '@/public/images';
import { useDispatch } from 'react-redux';
import { setCurrentInfo } from '@/redux/reducers/app';

type NavItemProps = {
    value: string;
    active: boolean;
    handleNavigate: (route: string) => void;
};

const NavItem = ({ value, active, handleNavigate }: NavItemProps) => (
    <div
        className={twMerge(
            'w-full h-[60px] flex items-center justify-between group px-[20px] select-none hover:bg-secondary cursor-pointer',
            active ? 'bg-secondary group-hover:text-primary' : 'bg-white text-black'
        )}
        onClick={() => handleNavigate(value)}
    >
        <div
            className={twMerge(
                'flex items-center gap-[20px] group-hover:text-primary font-medium',
                active ? 'text-primary' : 'text-black'
            )}
        >
            <p>{value}</p>
        </div>
        <div
            className={twMerge(
                'w-[6px] h-[20px] rounded-[100px] group-hover:bg-primary',
                active ? 'bg-primary' : 'bg-white'
            )}
        />
    </div>
);

const Sidebar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const path = usePathname();

    const handleNavigate = (route: string) => {
        dispatch(setCurrentInfo('barangay-info'));
        router.push(`/${route.toLocaleLowerCase()}`);
    };

    const isCurrentPage = (value: string) => {
        return path!.includes(value);
    };

    const handleLogout = () => {
        signOut(auth);
        localStorage.clear();
        router.push('/sign-in');
    };

    return (
        <nav className="w-[300px] h-full bg-white flex flex-col border border-r-gray-200">
            <section className="w-full bg-white h-[200px] relative">
                <Image fill src={logoImg} alt="logo" className="object-contain p-2" />
            </section>
            <section className="w-full flex flex-col text-[14px]">
                <NavItem active={isCurrentPage('/players')} value="Players" handleNavigate={handleNavigate} />
                <NavItem active={isCurrentPage('/coaches')} value="Coaches" handleNavigate={handleNavigate} />
                <NavItem active={isCurrentPage('/teams')} value="Teams" handleNavigate={handleNavigate} />
                <NavItem active={isCurrentPage('/sports')} value="Sports" handleNavigate={handleNavigate} />
            </section>
            <section className="w-full flex-1 flex items-end justify-center p-[20px]">
                <Button onClick={handleLogout} value="Logout" className="w-[200px]" />
            </section>
        </nav>
    );
};

export default Sidebar;

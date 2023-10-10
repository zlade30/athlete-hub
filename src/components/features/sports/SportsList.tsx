'use client';

import { PersonBox } from '@/components/shared';
import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExportIcon, PrintIcon, UserIcon } from '@/public/icons';
import { setShowSpinnerFallback } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';
import { Select } from '@/components/shared/options';
import { getSports } from '@/firebase-api/utils';
import { SpinnerDialog } from '@/components/shared/dialogs';
import Papa from 'papaparse';
import ReactToPrint from 'react-to-print';
import { SportsReport } from '.';
import { fbGetSports } from '@/firebase-api/sports';
import { setSports } from '@/redux/reducers/sports';
const SportsList = () => {
    const sportsReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { sports, selectedSport } = useAppSelector((state) => state.sports);
    const [sportsList, setSportsList] = useState<SportProps[]>([]);
    const [searchSport, setSearchSport] = useState('');
    const [isGuest, setIsGuest] = useState(false);

    const handleExport = () => {
        const refactorList = sportsList.map((item) => ({
            'SPORT NAME': item.name
        }));
        const csv = Papa.unparse(refactorList);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'report.csv';
        link.href = url;
        link.click();
    };

    const loadSports = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching sports...' }));
            const result = await fbGetSports();
            setSportsList(result);
            dispatch(setSports(result));
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        } catch (error) {
            console.log(error);
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        }
    };

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const result = sports.filter((item) => `${item.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
        setSportsList(result);
        setSearchSport(evt.target.value);
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative">
            <SpinnerDialog />
            {/* <SportsReport
                ref={sportsReportRef}
                coachList={sportsList}
                selectedSport={selectedSport}
                selectedBarangay={selectedBarangay}
            /> */}
            <div className="w-full p-[20px] flex items-center justify-between gap-[20px]">
                <div className="w-full flex items-center gap-[20px]">
                    <Input
                        containerClassName="w-[300px] flex flex-col gap-[4px]"
                        label="Search Sport"
                        type="text"
                        className="normal-case"
                        value={searchSport}
                        onChange={handleSearch}
                    />
                </div>
                {!isGuest && (
                    <div className="w-full flex items-center justify-end gap-[20px]">
                        <ExportIcon onClick={handleExport} className="w-[30px] h-[30px] cursor-pointer" />
                        <ReactToPrint
                            trigger={() => <PrintIcon className="w-[30px] h-[30px] cursor-pointer" />}
                            content={() => sportsReportRef.current!}
                        />
                    </div>
                )}
            </div>
            {showSpinnerFallback.show && <FallbackSpinner content="Fetching sports..." />}
            {sportsList.length === 0 && !showSpinnerFallback.show && (
                <FallbackEmpty icon={<UserIcon className="w-[50px] h-[50px]" />} content="List is currently empty." />
            )}
            {!showSpinnerFallback.show && (
                <div className="px-[20px]">
                    <table className="w-full table-auto text-[14px] border border-primary rounded-[8px]">
                        <thead className="h-[40px] border border-primary bg-primary">
                            <tr>
                                <th align="left" className="w-[40px]"></th>
                                <th align="left" className="text-white">
                                    Name
                                </th>
                                <th align="right" />
                            </tr>
                        </thead>
                        <tbody>
                            {sportsList.map((item, key) => (
                                <tr key={item.id} className="h-[50px] border border-primary bg-white">
                                    <td align="center">{key + 1}</td>
                                    <td>{`${item.name}`}</td>
                                    <td align="right" className="pr-[20px]">{`${item.name}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SportsList;

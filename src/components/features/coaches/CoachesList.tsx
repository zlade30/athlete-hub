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
import { fbGetCoaches } from '@/firebase-api/coaches';
import { setCoaches } from '@/redux/reducers/coaches';
import { CoachesReport } from '.';

const CoachesList = () => {
    const coachesReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { coaches } = useAppSelector((state) => state.coaches);
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [coachList, setCoachList] = useState<CoachProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [searchCoach, setSearchCoach] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [isGuest, setIsGuest] = useState(false);

    const handleKeyFilters = (list: CoachProps[], key: 'barangay' | 'sport', selectedKey: string) => {
        if (selectedKey === 'All') {
            return list.filter((item: CoachProps) => item[key] !== 'All');
        } else {
            return list.filter((item: CoachProps) => item[key] === selectedKey);
        }
    };

    const handleFilters = (list: CoachProps[]) => {
        const barangayFilter = handleKeyFilters(list, 'barangay', selectedBarangay);
        const filter = handleKeyFilters(barangayFilter, 'sport', selectedSport);
        return filter;
    };

    const handleExport = () => {
        const refactorList = coachList.map((item) => ({
            'LAST NAME': item.lastName,
            'FIRST NAME': item.firstName,
            AGE: item.age,
            ADDRESS: item.barangay,
            CATEGORY: item.sport
        }));
        const csv = Papa.unparse(refactorList);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'report.csv';
        link.href = url;
        link.click();
    };

    const loadCoaches = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching coaches...' }));
            const result = await fbGetCoaches();
            const list = handleFilters(result);
            dispatch(setCoaches(list!));
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        } catch (error) {
            console.log(error);
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        }
    };

    const loadSports = async () => {
        try {
            const list = await getSports();
            setSportList(list);
        } catch (error) {}
    };

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const result = coaches.filter((item) =>
            `${item.firstName} ${item.lastName}`.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        );
        const list = handleFilters(result);
        setCoachList(list);
        setSearchCoach(evt.target.value);
    };

    const handleSelectedItem = (item: SportsProps) => {
        setSelectedSport(item.value);
        setSearchCoach('');
    };

    useEffect(() => {
        loadCoaches();
    }, [selectedBarangay, selectedSport]);

    useEffect(() => {
        const list = handleFilters(coaches);
        setCoachList(list!);
    }, [coaches]);

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative">
            <SpinnerDialog />
            <CoachesReport
                ref={coachesReportRef}
                coachList={coachList}
                selectedSport={selectedSport}
                selectedBarangay={selectedBarangay}
            />
            <div className="w-full p-[20px] flex items-center justify-between gap-[20px]">
                <div className="w-full flex items-center gap-[20px]">
                    <Select
                        containerClassName="w-[200px] flex flex-col gap-[4px]"
                        label="Sports"
                        value={selectedSport}
                        data={sportList! || []}
                        onSelectItem={handleSelectedItem}
                    />
                    <Input
                        containerClassName="w-[300px] flex flex-col gap-[4px]"
                        label="Search Coach"
                        type="text"
                        className="normal-case"
                        value={searchCoach}
                        onChange={handleSearch}
                    />
                </div>
                {!isGuest && (
                    <div className="w-full flex items-center justify-end gap-[20px]">
                        <ExportIcon onClick={handleExport} className="w-[30px] h-[30px] cursor-pointer" />
                        <ReactToPrint
                            trigger={() => <PrintIcon className="w-[30px] h-[30px] cursor-pointer" />}
                            content={() => coachesReportRef.current!}
                        />
                    </div>
                )}
            </div>
            {showSpinnerFallback.show && <FallbackSpinner content="Fetching coaches..." />}
            {coachList.length === 0 && !showSpinnerFallback.show && (
                <FallbackEmpty icon={<UserIcon className="w-[50px] h-[50px]" />} content="List is currently empty." />
            )}
            {!showSpinnerFallback.show && (
                <div className="px-[20px] flex flex-wrap gap-[34.5px] columns-auto">
                    {coachList.map((person) => (
                        <PersonBox key={person.id} person={person} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoachesList;

'use client';

import { PersonBox } from '@/components/shared';
import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayers, setShowPlayerInformation } from '@/redux/reducers/players';
import { ExportIcon, PlusIcon, PrintIcon, UserIcon } from '@/public/icons';
import { setShowSpinnerFallback } from '@/redux/reducers/app';
import { fbGetPlayers } from '@/firebase-api/player';
import { Input } from '@/components/shared/textfields';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';
import { Select } from '@/components/shared/options';
import { getBarangay, getSports } from '@/firebase-api/utils';
import { SpinnerDialog } from '@/components/shared/dialogs';
import Papa from 'papaparse';
import ReactToPrint from 'react-to-print';
import { PlayersInformation, PlayersReport } from '.';
import { setBarangayList, setSelectedBarangay } from '@/redux/reducers/barangay';

const PlayersList = () => {
    const playersReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { players, showPlayerInformation } = useAppSelector((state) => state.player);
    const { selectedBarangay, barangayList } = useAppSelector((state) => state.barangay);
    const [playerList, setPlayerList] = useState<PlayerProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [searchPlayer, setSearchPlayer] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [isGuest, setIsGuest] = useState(false);

    const handleKeyFilters = (list: PlayerProps[], key: 'barangay' | 'sport', selectedKey: string) => {
        if (selectedKey === 'All') {
            return list.filter((item: PlayerProps) => item[key] !== 'All');
        } else {
            return list.filter((item: PlayerProps) => item[key] === selectedKey);
        }
    };

    const handleFilters = (list: PlayerProps[]) => {
        const barangayFilter = handleKeyFilters(list, 'barangay', selectedBarangay);
        const filter = handleKeyFilters(barangayFilter, 'sport', selectedSport);
        return filter;
    };

    const handleExport = () => {
        const refactorList = playerList.map((item) => ({
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

    const loadPlayers = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching players...' }));
            const result = await fbGetPlayers();
            const list = handleFilters(result);
            dispatch(setPlayers(list!));
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

    const loadBarangay = async () => {
        try {
            const list = await getBarangay();
            dispatch(setBarangayList(list));
        } catch (error) {}
    };

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const result = players.filter((item) =>
            `${item.firstName} ${item.lastName}`.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        );
        const list = handleFilters(result);
        setPlayerList(list);
        setSearchPlayer(evt.target.value);
    };

    const handleSelectedSport = (item: SportsProps) => {
        setSelectedSport(item.value);
        setSearchPlayer('');
    };

    const handleSelectedBarangay = (option: SelectPropsData) => {
        dispatch(setSelectedBarangay(option.value));
    };

    useEffect(() => {
        loadPlayers();
    }, [selectedBarangay, selectedSport]);

    useEffect(() => {
        const list = handleFilters(players);
        setPlayerList(list!);
    }, [players]);

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
        loadBarangay();
    }, []);

    return (
        <div className="w-full h-full flex flex-col relative">
            <PlayersInformation
                open={showPlayerInformation}
                handleClose={() => dispatch(setShowPlayerInformation(false))}
            />
            <SpinnerDialog />
            <PlayersReport
                ref={playersReportRef}
                playerList={playerList}
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
                        onSelectItem={handleSelectedSport}
                    />
                    <Select
                        containerClassName="w-[200px] flex flex-col gap-[4px]"
                        label="Barangay"
                        value={selectedBarangay}
                        data={barangayList! || []}
                        onSelectItem={handleSelectedBarangay}
                    />
                    <Input
                        containerClassName="w-[300px] flex flex-col gap-[4px]"
                        label="Search Player"
                        type="text"
                        className="normal-case"
                        value={searchPlayer}
                        onChange={handleSearch}
                    />
                </div>
                {!isGuest && (
                    <div className="w-full flex items-center justify-end gap-[20px]">
                        <ExportIcon onClick={handleExport} className="w-[30px] h-[30px] cursor-pointer" />
                        <ReactToPrint
                            trigger={() => <PrintIcon className="w-[30px] h-[30px] cursor-pointer" />}
                            content={() => playersReportRef.current!}
                        />
                        <PlusIcon
                            onClick={() => dispatch(setShowPlayerInformation(true))}
                            className="w-[20px] h-[20px] cursor-pointer"
                        />
                    </div>
                )}
            </div>
            {showSpinnerFallback.show && <FallbackSpinner content="Fetching players..." />}
            {playerList.length === 0 && !showSpinnerFallback.show && (
                <FallbackEmpty icon={<UserIcon className="w-[50px] h-[50px]" />} content="List is currently empty." />
            )}
            {!showSpinnerFallback.show && (
                <div className="px-[20px] flex flex-wrap gap-[26px] columns-auto overflow-auto">
                    {playerList.map((player) => (
                        <PersonBox key={player.id} person={player} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayersList;

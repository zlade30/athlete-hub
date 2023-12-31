'use client';

import { PersonBox } from '@/components/shared';
import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    setPlayers,
    setShowPlayerAchievements,
    setShowPlayerFiles,
    setShowPlayerInformation
} from '@/redux/reducers/players';
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
import { PlayersAchievements, PlayersInformation, PlayersReport } from '.';
import { setBarangayList, setSelectedBarangay } from '@/redux/reducers/barangay';
import PlayersFiles from './PlayersFiles';
import { generateId } from '@/utils/helpers';
import { Button } from '@/components/shared/buttons';

const PlayersList = () => {
    const playersReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { players, showPlayerInformation, showPlayerAchievements, showPlayerFiles } = useAppSelector(
        (state) => state.player
    );
    const { selectedBarangay, barangayList } = useAppSelector((state) => state.barangay);
    const [playerList, setPlayerList] = useState<PlayerProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [genderList, setGenderList] = useState<GenderProps[]>([]);
    const [searchPlayer, setSearchPlayer] = useState('');
    const [age, setAge] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [showAchievements, setShowAchievements] = useState(false);
    const [showActive, setShowActive] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

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
            setPlayerList(result);
            dispatch(setPlayers(result));
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

    const loadGenders = () => {
        setGenderList([
            { id: generateId(10), value: 'All' },
            { id: generateId(10), value: 'Male' },
            { id: generateId(10), value: 'Female' }
        ]);
    };

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setSearchPlayer(value);
    };

    const handleSelectedSport = (item: SportsProps) => {
        setSelectedSport(item.value);
        setSearchPlayer('');
    };

    const handleSelectedBarangay = (option: SelectPropsData) => {
        dispatch(setSelectedBarangay(option.value));
    };

    const handleSelectedGender = (option: SelectPropsData) => {
        setSelectedGender(option.value);
    };

    const handleAge = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setAge(value);
    };

    const handleShowAchievements = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching players...' }));
            const result = await fbGetPlayers();
            const list = result.filter((item) => Boolean(item.achievements) === showAchievements);
            dispatch(setPlayers(list!));
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        } catch (error) {
            console.log(error);
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        }
    };

    const handleShowActive = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching players...' }));
            const result = await fbGetPlayers();
            const list = result.filter((item) => item.active === showActive);
            dispatch(setPlayers(list!));
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        } catch (error) {
            console.log(error);
            dispatch(setShowSpinnerFallback({ show: false, content: '' }));
        }
    };

    const handleClearSelection = () => {
        dispatch(setPlayers(players.map((player) => ({ ...player, selected: false }))));
    };

    const handleFilters = () => {
        console.log(showAchievements);
        const filter = players.filter(
            (player) =>
                !player.removed &&
                Boolean(player.achievements) === showAchievements &&
                player.active === showActive &&
                (age === '' || player.age === age) &&
                (selectedSport === 'All' || player.sport === selectedSport) &&
                (selectedBarangay === 'All' || player.barangay === selectedBarangay) &&
                (selectedGender === 'All' || player.gender === selectedGender) &&
                `${player.firstName} ${player.lastName}`.toLocaleLowerCase().includes(searchPlayer.toLocaleLowerCase())
        );
        setPlayerList(filter);
    };

    useEffect(() => {
        loadPlayers();
    }, [selectedBarangay, selectedSport, selectedGender]);

    useEffect(() => {
        handleShowAchievements();
    }, [showAchievements]);

    useEffect(() => {
        handleShowActive();
    }, [showActive]);

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
        loadBarangay();
        loadGenders();
    }, []);

    useEffect(() => {
        if (players.length) handleFilters();
    }, [age, searchPlayer, selectedBarangay, selectedSport, showActive, showAchievements, players]);

    return (
        <div className="w-full h-full flex flex-col relative pb-[20px]">
            <PlayersInformation
                open={showPlayerInformation}
                handleClose={() => dispatch(setShowPlayerInformation(false))}
            />
            <PlayersReport
                ref={playersReportRef}
                isGuest={isGuest}
                playerList={playerList}
                selectedSport={selectedSport}
                selectedBarangay={selectedBarangay}
            />
            <PlayersAchievements
                open={showPlayerAchievements}
                handleClose={() => dispatch(setShowPlayerAchievements(false))}
            />
            <PlayersFiles open={showPlayerFiles} handleClose={() => dispatch(setShowPlayerFiles(false))} />
            <SpinnerDialog />
            <div className="w-full p-[20px] flex items-center justify-between gap-[20px]">
                <div className="w-full flex items-center gap-[20px]">
                    <span className="flex items-center gap-[10px] whitespace-nowrap mt-6">
                        <input
                            type="checkbox"
                            checked={showAchievements}
                            onChange={() => setShowAchievements(!showAchievements)}
                        />
                        <label className="text-[14px]">Achievements</label>
                    </span>
                    <span className="flex items-center gap-[10px] whitespace-nowrap mt-6">
                        <input type="checkbox" checked={showActive} onChange={() => setShowActive(!showActive)} />
                        <label className="text-[14px]">Active</label>
                    </span>
                    <Input
                        containerClassName="w-[100px] flex flex-col gap-[4px]"
                        label="Age"
                        type="number"
                        value={age}
                        onChange={handleAge}
                    />
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
                    <Select
                        containerClassName="w-[200px] flex flex-col gap-[4px]"
                        label="Gender"
                        value={selectedGender}
                        data={genderList! || []}
                        onSelectItem={handleSelectedGender}
                    />
                    <Input
                        containerClassName="w-[300px] flex flex-col gap-[4px]"
                        label="Search Player"
                        type="text"
                        className="normal-case"
                        value={searchPlayer}
                        onChange={handleSearch}
                    />
                    {isGuest && players.some((player) => player.selected) && (
                        <Button onClick={handleClearSelection} value="Clear" className="mt-[20px]" />
                    )}
                </div>
                <div className="w-full flex items-center justify-end gap-[20px]">
                    {!isGuest && <ExportIcon onClick={handleExport} className="w-[30px] h-[30px] cursor-pointer" />}
                    <ReactToPrint
                        trigger={() => <PrintIcon className="w-[30px] h-[30px] cursor-pointer" />}
                        content={() => playersReportRef.current!}
                    />
                    {!isGuest && (
                        <PlusIcon
                            onClick={() => dispatch(setShowPlayerInformation(true))}
                            className="w-[20px] h-[20px] cursor-pointer"
                        />
                    )}
                </div>
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

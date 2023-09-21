'use client';

import { PersonBox } from '@/components/shared';
import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayers } from '@/redux/reducers/players';
import { UserIcon } from '@/public/icons';
import { setShowSpinnerFallback } from '@/redux/reducers/app';
import { fbGetPlayers } from '@/firebase-api/player';
import { Input } from '@/components/shared/textfields';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';
import { Select } from '@/components/shared/options';
import { getSports } from '@/firebase-api/utils';
import { SpinnerDialog } from '@/components/shared/dialogs';

const PlayersList = () => {
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { players } = useAppSelector((state) => state.player);
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [playerList, setPlayerList] = useState<PlayerProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [searchPlayer, setSearchPlayer] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');

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

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const result = players.filter((item) =>
            `${item.firstName} ${item.lastName}`.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        );
        const list = handleFilters(result);
        setPlayerList(list);
        setSearchPlayer(evt.target.value);
    };

    const handleSelectedItem = (item: SportsProps) => {
        setSelectedSport(item.value);
        setSearchPlayer('');
    };

    useEffect(() => {
        loadPlayers();
    }, [selectedBarangay, selectedSport]);

    useEffect(() => {
        const list = handleFilters(players);
        setPlayerList(list!);
    }, [players]);

    useEffect(() => {
        loadSports();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto">
            <SpinnerDialog />
            <div className="w-full p-[20px] flex items-center justify-start gap-[20px]">
                <Select
                    containerClassName="w-[200px] flex flex-col gap-[4px]"
                    label="Sports"
                    value={selectedSport}
                    data={sportList! || []}
                    onSelectItem={handleSelectedItem}
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
            {showSpinnerFallback.show && <FallbackSpinner content="Fetching players..." />}
            {playerList.length === 0 && !showSpinnerFallback.show && (
                <FallbackEmpty icon={<UserIcon className="w-[50px] h-[50px]" />} content="List is currently empty." />
            )}
            {!showSpinnerFallback.show && (
                <div className="px-[20px] flex flex-wrap gap-[34.5px] columns-auto">
                    {playerList.map((player) => (
                        <PersonBox key={player.id} player={player} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayersList;

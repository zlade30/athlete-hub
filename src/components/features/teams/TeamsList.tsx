'use client';

import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExportIcon, PrintIcon, UserGroupIcon } from '@/public/icons';
import { setShowSpinnerFallback } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';
import { getSports } from '@/firebase-api/utils';
import { SpinnerDialog } from '@/components/shared/dialogs';
import Papa from 'papaparse';
import ReactToPrint from 'react-to-print';
import { fbGetTeams } from '@/firebase-api/teams';
import { setIsPlayerSelection, setSelectedTeam, setTeams } from '@/redux/reducers/teams';
import TeamBox from '@/components/shared/TeamBox';
import { TeamPlayersSelection } from '.';

const TeamsList = () => {
    const playersReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { teams, isPlayerSelection } = useAppSelector((state) => state.teams);
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [teamList, setTeamList] = useState<TeamProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [searchTeam, setSearchTeam] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [isGuest, setIsGuest] = useState(false);

    const handleExport = () => {
        const refactorList = teamList.map((item) => ({
            'TEAM NAME': item.name,
            COACH: item.coach
        }));
        const csv = Papa.unparse(refactorList);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'report.csv';
        link.href = url;
        link.click();
    };

    const loadTeams = async () => {
        try {
            dispatch(setShowSpinnerFallback({ show: true, content: 'Fetching teams...' }));
            const result = await fbGetTeams();
            dispatch(setTeams(result));
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
        const result = teams.filter((item) => `${item.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
        setTeamList(result);
        setSearchTeam(evt.target.value);
    };

    useEffect(() => {
        loadTeams();
    }, [selectedBarangay, selectedSport]);

    useEffect(() => {
        setTeamList(teams);
    }, [teams]);

    useEffect(() => {
        dispatch(setIsPlayerSelection(false));
        dispatch(setSelectedTeam());
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative">
            {!isPlayerSelection ? (
                <>
                    <SpinnerDialog />
                    {/* <PlayersReport
                        ref={playersReportRef}
                        playerList={playerList}
                        selectedSport={selectedSport}
                        selectedBarangay={selectedBarangay}
                    /> */}
                    <div className="w-full p-[20px] flex items-center justify-between gap-[20px]">
                        <div className="w-full flex items-center gap-[20px]">
                            <Input
                                containerClassName="w-[300px] flex flex-col gap-[4px]"
                                label="Search Team"
                                type="text"
                                className="normal-case"
                                value={searchTeam}
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
                            </div>
                        )}
                    </div>
                    {showSpinnerFallback.show && <FallbackSpinner content="Fetching teams..." />}
                    {teamList.length === 0 && !showSpinnerFallback.show && (
                        <FallbackEmpty
                            icon={<UserGroupIcon className="w-[50px] h-[50px]" />}
                            content="List is currently empty."
                        />
                    )}
                    {!showSpinnerFallback.show && (
                        <div className="px-[20px] flex flex-wrap gap-[34.5px] columns-auto">
                            {teamList.map((team) => (
                                <TeamBox key={team.id} team={team} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <TeamPlayersSelection />
            )}
        </div>
    );
};

export default TeamsList;

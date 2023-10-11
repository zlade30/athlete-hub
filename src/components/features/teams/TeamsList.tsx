'use client';

import { useAppSelector } from '@/redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ExportIcon, PlusIcon, PrintIcon, UserGroupIcon } from '@/public/icons';
import { setShowSpinnerFallback } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { FallbackEmpty, FallbackSpinner } from '@/components/shared/fallbacks';
import { getSports } from '@/firebase-api/utils';
import { SpinnerDialog } from '@/components/shared/dialogs';
import Papa from 'papaparse';
import ReactToPrint from 'react-to-print';
import { fbGetTeams } from '@/firebase-api/teams';
import {
    setSelectedPlayers,
    setSelectedTeam,
    setShowTeamInformation,
    setShowTeamPlayerSelection,
    setTeams
} from '@/redux/reducers/teams';
import TeamBox from '@/components/shared/TeamBox';
import { TeamInformation, TeamPlayersSelection, TeamReport } from '.';

const TeamsList = () => {
    const playersReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { teams, showTeamInformation, showTeamPlayerSelection } = useAppSelector((state) => state.teams);
    const { selectedBarangay } = useAppSelector((state) => state.barangay);
    const [teamList, setTeamList] = useState<TeamProps[]>([]);
    const [sportList, setSportList] = useState<SportsProps[]>([]);
    const [searchTeam, setSearchTeam] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');
    const [isGuest, setIsGuest] = useState(false);

    const handleExport = () => {
        let exportList: { teamName: string; coach: string; player: string; sport: string }[] = [];
        teamList.forEach((team) => {
            team.players.forEach((player) => {
                const payload = {
                    teamName: team.name,
                    coach: team.coach,
                    player: `${player.firstName} ${player.lastName}`,
                    sport: team.sport
                };
                exportList = [...exportList, payload];
            });
        });

        const refactorList = exportList.map((item) => ({
            'TEAM NAME': item.teamName,
            COACH: item.coach,
            PLAYER: item.player,
            SPORT: item.sport
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
        dispatch(setSelectedTeam());
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadSports();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto relative">
            <TeamInformation open={showTeamInformation} handleClose={() => dispatch(setShowTeamInformation(false))} />
            <TeamPlayersSelection
                open={showTeamPlayerSelection}
                handleClose={() => dispatch(setShowTeamPlayerSelection(false))}
            />
            <SpinnerDialog />
            <TeamReport ref={playersReportRef} teamList={teamList} />
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
                        <PlusIcon
                            onClick={() => {
                                dispatch(setSelectedPlayers([]));
                                dispatch(setShowTeamInformation(true));
                            }}
                            className="w-[20px] h-[20px] cursor-pointer"
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
        </div>
    );
};

export default TeamsList;

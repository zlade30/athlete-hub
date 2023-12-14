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
    setShowTeamAchievements,
    setShowTeamInformation,
    setShowTeamPlayerSelection,
    setTeams
} from '@/redux/reducers/teams';
import TeamBox from '@/components/shared/TeamBox';
import { Modal, SelectTeamBox } from '@/components/shared';
import { setSelectedTeams } from '@/redux/reducers/highlights';
import { Button } from '@/components/shared/buttons';

const TeamsSelection = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const playersReportRef = useRef();
    const dispatch = useDispatch();
    const { showSpinnerFallback } = useAppSelector((state) => state.app);
    const { teams } = useAppSelector((state) => state.teams);
    const { selectedTeams } = useAppSelector((state) => state.highlights);
    const [teamList, setTeamList] = useState<TeamProps[]>([]);
    const [searchTeam, setSearchTeam] = useState('');
    const [isGuest, setIsGuest] = useState(false);

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

    const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        const result = teams.filter((item) => `${item.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
        const filter = result.map((item) =>
            selectedTeams.some((team) => team.id === item.id)
                ? { ...item, selected: true }
                : { ...item, selected: false }
        );
        setTeamList(filter);
        setSearchTeam(evt.target.value);
    };

    const handleSelectedTeam = (team: TeamProps | TeamHighlightProps) => {
        const selectedTeam = team as TeamHighlightProps;
        const updateList = teamList.map((item) =>
            item.id === selectedTeam.id ? { ...item, selected: !item.selected } : item
        );
        setTeamList(updateList);
        if (!selectedTeam.selected) {
            dispatch(setSelectedTeams([...selectedTeams, selectedTeam]));
        } else {
            const removeTeams = selectedTeams.filter((item) => item.id !== selectedTeam.id);
            dispatch(setSelectedTeams(removeTeams));
        }
    };

    useEffect(() => {
        setTeamList(teams);
    }, [teams]);

    useEffect(() => {
        const updateList = teamList.map((item) =>
            selectedTeams.some((team) => team.id === item.id)
                ? { ...item, selected: true }
                : { ...item, selected: false }
        );
        setTeamList(updateList);
    }, [selectedTeams]);

    useEffect(() => {
        dispatch(setSelectedTeam());
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadTeams();
    }, []);

    return (
        <Modal open={open} handleClose={handleClose}>
            <div className="w-screen h-screen flex flex-col overflow-y-auto relative bg-white">
                <SpinnerDialog />
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
                    <Button className="w-[100px]" onClick={handleClose} value="Done" />
                </div>
                {showSpinnerFallback.show && <FallbackSpinner content="Fetching teams..." />}
                {teamList.length === 0 && !showSpinnerFallback.show && (
                    <FallbackEmpty
                        icon={<UserGroupIcon className="w-[50px] h-[50px]" />}
                        content="List is currently empty."
                    />
                )}
                {!showSpinnerFallback.show && (
                    <div className="px-[20px] flex flex-wrap gap-[34.5px] columns-auto overflow-auto">
                        {teamList.map((team) => (
                            <SelectTeamBox key={team.id} team={team} handleSelectedTeam={handleSelectedTeam} />
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TeamsSelection;

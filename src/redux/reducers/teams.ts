import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    teams: TeamProps[];
    selectedTeam: TeamProps | undefined;
    selectedPlayers: TeamPlayerProps[];
    showTeamInformation: boolean;
    showTeamPlayerSelection: boolean;
};

const initialState: InitialStateProps = {
    teams: [],
    selectedTeam: undefined,
    selectedPlayers: [],
    showTeamInformation: false,
    showTeamPlayerSelection: false
};

export const slice = createSlice({
    initialState,
    name: 'teams',
    reducers: {
        setTeams: (state, action: PayloadAction<TeamProps[]>) => {
            state.teams = action.payload
        },
        createTeam: (state, action: PayloadAction<TeamProps>) => {
            state.teams = [action.payload, ...state.teams]
        },
        removeTeam: (state, action: PayloadAction<string>) => {
            state.teams = state.teams.filter((item) => item.id !== action.payload);
        },
        updateTeam: (state, action: PayloadAction<TeamProps>) => {
            state.teams = state.teams.map((item) => item.id === action.payload.id ? { ...action.payload } : item)
        },
        setSelectedTeam: (state, action: PayloadAction<TeamProps | undefined>) => {
            state.selectedTeam = action.payload
        },
        setShowTeamPlayerSelection: (state, action: PayloadAction<boolean>) => {
            state.showTeamPlayerSelection = action.payload
        },
        setSelectedPlayers: (state, action: PayloadAction<TeamPlayerProps[]>) => {
            state.selectedPlayers = action.payload
        },
        setShowTeamInformation: (state, action: PayloadAction<boolean>) => {
            state.showTeamInformation = action.payload
        },
    }
});

export const {
    setTeams,
    updateTeam,
    createTeam,
    removeTeam,
    setSelectedTeam,
    setSelectedPlayers,
    setShowTeamInformation,
    setShowTeamPlayerSelection
} = slice.actions;

export default slice.reducer;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type InitialStateProps = {
    teams: TeamProps[];
    isPlayerSelection: boolean;
    selectedTeam: TeamProps | undefined;
    selectedPlayers: TeamPlayerProps[];
};

const initialState: InitialStateProps = {
    teams: [],
    selectedTeam: undefined,
    isPlayerSelection: false,
    selectedPlayers: []
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
        setIsPlayerSelection: (state, action: PayloadAction<boolean>) => {
            state.isPlayerSelection = action.payload
        },
        setSelectedPlayers: (state, action: PayloadAction<TeamPlayerProps[]>) => {
            state.selectedPlayers = action.payload
        }
    }
});

export const {
    setTeams,
    updateTeam,
    createTeam,
    removeTeam,
    setSelectedTeam,
    setSelectedPlayers,
    setIsPlayerSelection
} = slice.actions;

export default slice.reducer;
